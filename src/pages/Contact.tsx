
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { contactService } from '@/lib/firebase-database';
import { storageService } from '@/lib/firebase-storage';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ContactPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitError, setSubmitError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!email || !message) {
      setSubmitStatus('error');
      setSubmitError('Email et message sont obligatoires.');
      return;
    }

    if (files.length > 5) {
      setSubmitStatus('error');
      setSubmitError('Tu peux envoyer jusqu\'a 5 images maximum.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length !== files.length) {
        setSubmitStatus('error');
        setSubmitError('Seules les images sont acceptees dans ce formulaire.');
        setIsSubmitting(false);
        return;
      }

      const uploadResults = await Promise.all(
        imageFiles.map((file) => {
          const validation = storageService.validateFile(file);
          if (!validation.valid) {
            throw new Error(validation.error || 'Fichier invalide.');
          }
          return storageService.uploadFile(file, `contact-images/${Date.now()}`);
        })
      );

      await contactService.addContactMessage({
        email,
        message,
        imageUrls: uploadResults.map((result) => result.url),
      });

      setSubmitStatus('success');
      setMessage('');
      setFiles([]);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'envoi.');
      console.error("Failed to send message:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Formulaire de contact</CardTitle>
          <CardDescription>
            Dis-nous ce que tu as aimé et ce que nous pouvons améliorer !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Ton Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="ton.email@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Cet espace est dédié à tes retours, signalements de problèmes, suggestions d'amélioration ou toute autre remarque concernant le site. Je ferai tout mon possible pour en tenir compte dans les plus brefs délais.
              </Label>
              <Textarea
                id="message"
                placeholder="Ton message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Joindre des images</Label>
              <Label 
                htmlFor="file-upload" 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors block"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Glisse-dépose ou clique pour sélectionner des fichiers</p>
                <Input id="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
              </Label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Fichiers joints</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-5 w-5" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {submitStatus === 'success' && (
              <Alert variant="default">
                <AlertDescription>Merci ! Ton message a bien été envoyé. Nous te répondrons bientôt.</AlertDescription>
              </Alert>
            )}
            {submitStatus === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>{submitError || 'Oops ! Une erreur s\'est produite. Veuillez reessayer.'}</AlertDescription>
              </Alert>
            )}

            <div className="text-right">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
