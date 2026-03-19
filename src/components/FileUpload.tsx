import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { storageService } from '@/lib/firebase-storage';
import { courseService } from '@/lib/firebase-database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  subjectId: string;
  chapterId: string;
  onUploadComplete?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  subjectId,
  chapterId,
  onUploadComplete
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const courseTypes = [
    { value: 'cours', label: 'Cours' },
    { value: 'td', label: 'TD' },
    { value: 'correction-td', label: 'Correction TD' },
    { value: 'ds', label: 'DS' },
    { value: 'correction-ds', label: 'Correction DS' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = storageService.validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Fichier invalide');
      return;
    }

    setSelectedFile(file);
    setError('');
    
    // Auto-remplir le titre avec le nom du fichier
    if (!title) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setTitle(nameWithoutExtension);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !type || !user) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Upload du fichier vers Firebase Storage
      const uploadPath = `courses/${subjectId}/${chapterId}/${type}`;
      const uploadResult = await storageService.uploadFile(
        selectedFile,
        uploadPath,
        (progress) => setUploadProgress(progress)
      );

      // Ajouter les métadonnées à Firestore
      await courseService.addCourse({
        title,
        description,
        subjectId,
        chapterId,
        type: type as any,
        fileUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.size,
        uploadedBy: user.uid,
        uploadedAt: new Date(),
        isPublic: true,
        downloadCount: 0
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setType('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadComplete?.();

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError('Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Vous devez être connecté pour uploader des fichiers.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Fichier
        </CardTitle>
        <CardDescription>
          Ajoutez un nouveau document (cours, TD, correction, DS)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500/50 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Fichier uploadé avec succès !</AlertDescription>
          </Alert>
        )}

        {/* File Input */}
        <div className="space-y-2">
          <Label htmlFor="file">Fichier *</Label>
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              id="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              disabled={uploading}
            />
            {selectedFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeFile}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({storageService.formatFileSize(selectedFile.size)})
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Chapitre 1 - Introduction aux matrices"
            disabled={uploading}
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type de document *</Label>
          <Select value={type} onValueChange={setType} disabled={uploading}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {courseTypes.map((courseType) => (
                <SelectItem key={courseType.value} value={courseType.value}>
                  {courseType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnel)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du contenu..."
            disabled={uploading}
          />
        </div>

        {/* Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Upload en cours...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !title || !type || uploading}
          className="w-full"
        >
          {uploading ? 'Upload en cours...' : 'Uploader le fichier'}
        </Button>
      </CardContent>
    </Card>
  );
};