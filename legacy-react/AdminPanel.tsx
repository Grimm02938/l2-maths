import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload as UploadIcon, 
  File, 
  X, 
  Plus, 
  Send, 
  Settings,
  Users,
  FileText,
  BarChart3,
  Shield,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

// Interface pour les documents
interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  year: string;
  tags: string[];
  uploadDate: string;
  fileSize: number;
  downloads: number;
}

// Interface pour les fichiers en cours d'upload
interface PendingFile {
  id: string;
  file: File;
  title: string;
  description: string;
  category: string;
  subject: string;
  year: string;
  tags: string[];
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Vérification des droits d'administration
  const isAdmin = user?.email === 'abdelmoulaadame800@gmail.com';

  const handleFileUpload = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: PendingFile[] = Array.from(selectedFiles).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
      description: '',
      category: '',
      subject: '',
      year: '',
      tags: []
    }));

    setPendingFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileUpload(droppedFiles);
  };

  const updatePendingFile = (id: string, field: keyof PendingFile, value: any) => {
    setPendingFiles(prev => prev.map(file => 
      file.id === id ? { ...file, [field]: value } : file
    ));
  };

  const removePendingFile = (id: string) => {
    setPendingFiles(prev => prev.filter(file => file.id !== id));
  };

  const addTag = (id: string, tag: string) => {
    if (!tag.trim()) return;
    const file = pendingFiles.find(f => f.id === id);
    if (file) {
      updatePendingFile(id, 'tags', [...file.tags, tag.trim()]);
    }
  };

  const removeTag = (id: string, tagIndex: number) => {
    const file = pendingFiles.find(f => f.id === id);
    if (file) {
      const newTags = file.tags.filter((_, index) => index !== tagIndex);
      updatePendingFile(id, 'tags', newTags);
    }
  };

  const publishDocuments = async () => {
    if (pendingFiles.length === 0) {
      toast.error('Aucun document à publier');
      return;
    }

    // Vérifier que tous les champs obligatoires sont remplis
    const incompleteFiles = pendingFiles.filter(file => 
      !file.title.trim() || !file.description.trim() || !file.category || !file.subject || !file.year
    );

    if (incompleteFiles.length > 0) {
      toast.error('Veuillez remplir tous les champs obligatoires pour chaque document');
      return;
    }

    try {
      // Ici tu pourras ajouter la logique Firebase pour sauvegarder
      console.log('Publication des documents:', pendingFiles);
      
      // Simuler la publication
      const newDocuments: Document[] = pendingFiles.map(file => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.title,
        description: file.description,
        category: file.category,
        subject: file.subject,
        year: file.year,
        tags: file.tags,
        uploadDate: new Date().toISOString(),
        fileSize: file.file.size,
        downloads: 0
      }));

      setDocuments(prev => [...prev, ...newDocuments]);
      setPendingFiles([]);
      
      toast.success(`${newDocuments.length} document(s) publié(s) avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error('Erreur lors de la publication des documents');
    }
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Document supprimé');
  };

  // Protection : Seul l'admin peut accéder
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Vous devez être connecté pour accéder au panneau d'administration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
            <p>Seul l'administrateur peut accéder à cette page.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Utilisateur connecté : {user.email}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-300/30">
            <Settings className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panneau d'Administration</h1>
            <p className="text-muted-foreground">Gestion complète de L2 MATHS Archive</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Gérer Documents
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          {/* Onglet Upload */}
          <TabsContent value="upload" className="space-y-6">
            {/* Zone de drop */}
            <Card>
              <CardContent className="p-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                >
                  <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Glissez vos documents ici</h3>
                  <p className="text-muted-foreground mb-4">
                    Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 10MB par fichier)
                  </p>
                  <Label htmlFor="admin-file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Choisir des fichiers
                    </Button>
                  </Label>
                  <Input
                    id="admin-file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Documents en attente */}
            {pendingFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Documents en attente ({pendingFiles.length})</h2>
                  <Button onClick={publishDocuments} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Publier tous les documents
                  </Button>
                </div>
                
                {pendingFiles.map((fileItem) => (
                  <Card key={fileItem.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <File className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-base">{fileItem.file.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePendingFile(fileItem.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${fileItem.id}`}>Titre du document *</Label>
                            <Input
                              id={`title-${fileItem.id}`}
                              placeholder="Ex: Cours d'Analyse Chapitre 3"
                              value={fileItem.title}
                              onChange={(e) => updatePendingFile(fileItem.id, 'title', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`description-${fileItem.id}`}>Description *</Label>
                            <Textarea
                              id={`description-${fileItem.id}`}
                              placeholder="Décrivez le contenu du document..."
                              value={fileItem.description}
                              onChange={(e) => updatePendingFile(fileItem.id, 'description', e.target.value)}
                              className="resize-none h-24"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Catégorie *</Label>
                            <Select
                              value={fileItem.category}
                              onValueChange={(value) => updatePendingFile(fileItem.id, 'category', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cours">Cours</SelectItem>
                                <SelectItem value="td">TD</SelectItem>
                                <SelectItem value="correction">Correction</SelectItem>
                                <SelectItem value="exercices">Exercices</SelectItem>
                                <SelectItem value="annales">Annales</SelectItem>
                                <SelectItem value="resume">Résumé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>Année *</Label>
                              <Select
                                value={fileItem.year}
                                onValueChange={(value) => updatePendingFile(fileItem.id, 'year', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="L2" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="L1">L1</SelectItem>
                                  <SelectItem value="L2">L2</SelectItem>
                                  <SelectItem value="L3">L3</SelectItem>
                                  <SelectItem value="M1">M1</SelectItem>
                                  <SelectItem value="M2">M2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Matière *</Label>
                              <Select
                                value={fileItem.subject}
                                onValueChange={(value) => updatePendingFile(fileItem.id, 'subject', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Matière" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="analyse">Analyse</SelectItem>
                                  <SelectItem value="algebre">Algèbre</SelectItem>
                                  <SelectItem value="geometrie">Géométrie</SelectItem>
                                  <SelectItem value="probabilites">Probabilités</SelectItem>
                                  <SelectItem value="statistiques">Statistiques</SelectItem>
                                  <SelectItem value="informatique">Informatique</SelectItem>
                                  <SelectItem value="physique">Physique</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <Label>Tags (optionnel)</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {fileItem.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button
                                onClick={() => removeTag(fileItem.id, index)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <Input
                          placeholder="Ajouter un tag et appuyez sur Entrée..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addTag(fileItem.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Gestion des documents */}
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents publiés ({documents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucun document publié pour le moment.</p>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{doc.category}</Badge>
                            <Badge variant="outline">{doc.subject}</Badge>
                            <Badge variant="outline">{doc.year}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteDocument(doc.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Utilisateurs */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fonctionnalité à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques du site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="text-2xl font-bold">{documents.length}</h3>
                    <p className="text-muted-foreground">Documents</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="text-2xl font-bold">0</h3>
                    <p className="text-muted-foreground">Utilisateurs</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="text-2xl font-bold">0</h3>
                    <p className="text-muted-foreground">Téléchargements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;