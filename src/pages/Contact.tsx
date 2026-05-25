import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { File as FileIcon, X, MessageSquareQuote, ImagePlus, Sparkles, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { contactService } from '@/lib/firebase-database';
import { storageService } from '@/lib/firebase-storage';

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
    setSubmitStatus(null);

    if (!email || !message) {
      setSubmitStatus('error');
      setSubmitError('Email et message sont obligatoires.');
      return;
    }

    if (files.length > 5) {
      setSubmitStatus('error');
      setSubmitError("Tu peux envoyer jusqu'à 5 images maximum.");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length !== files.length) {
        setSubmitStatus('error');
        setSubmitError('Seules les images sont acceptées dans ce formulaire.');
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
        }),
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
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.");
      console.error('Failed to send message:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                Messagerie
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Envoie un message clair, vite fait</h1>
                <p className="max-w-2xl text-muted-foreground">
                  Signale un bug, propose une amélioration ou partage une remarque. Le formulaire reste léger et rapide à remplir.
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                Réponse plus rapide
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                Jusqu'à 5 images
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                Interface simplifiée
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquareQuote className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Un seul endroit pour tout dire</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Tes retours passent directement dans l'espace de suivi du site.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="font-medium text-foreground">Ce que tu peux envoyer</p>
                <p className="mt-1">Idées, problèmes d'affichage, corrections de contenu, ou captures d'écran.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="font-medium text-foreground">Format simple</p>
                <p className="mt-1">Email, message court et pièces jointes si nécessaire. Rien de plus.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="font-medium text-foreground">Conseil</p>
                <p className="mt-1">Ajoute une capture d'écran si tu veux qu'on comprenne le problème plus vite.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Ton message</CardTitle>
              <CardDescription>Reste bref, c'est plus lisible et plus rapide à traiter.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ton.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">On t'écrira à cette adresse si besoin.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Décris ton souci ou ton idée en quelques lignes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Images</Label>
                  <Label
                    htmlFor="file-upload"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/70 bg-background/60 p-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium">Glisse-dépose ou clique pour ajouter des images</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP — 5 fichiers max</p>
                    <Input id="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                  </Label>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Fichiers joints</Label>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-3 py-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate text-sm">{file.name}</span>
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
                  <Alert className="border-primary/20 bg-primary/10">
                    <AlertDescription>Merci ! Ton message a bien été envoyé.</AlertDescription>
                  </Alert>
                )}
                {submitStatus === 'error' && (
                  <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
                    <AlertDescription>{submitError || "Oops ! Une erreur s'est produite. Veuillez réessayer."}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
