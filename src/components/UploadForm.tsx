import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  tags: z.string(),
  file: z.instanceof(FileList).refine(files => files?.length === 1, 'Un fichier est requis'),
});

type FormValues = z.infer<typeof formSchema>;

const UploadForm = () => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const file = data.file[0];
    if (!file) return;

    setIsUploading(true);
    const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        setIsUploading(false);
        toast({ title: 'Erreur', description: "Échec de l'upload.", variant: 'destructive' });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        await addDoc(collection(db, 'documents'), {
          title: data.title,
          description: data.description,
          tags: tagsArray,
          url: downloadURL,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          createdAt: serverTimestamp(),
        });

        setIsUploading(false);
        setUploadProgress(null);
        reset();
        toast({ title: 'Succès', description: 'Le fichier a été uploadé.' });
      }
    );
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-dashed border-primary/50">
      <CardHeader>
        <CardTitle className="text-center text-xl">Uploader un nouveau document</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Input placeholder="Titre du document" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Textarea placeholder="Description..." {...register('description')} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Input placeholder="Tags (séparés par des virgules)" {...register('tags')} />
          </div>

          <div className="space-y-2">
            <Input type="file" {...register('file')} />
            {errors.file && <p className="text-sm text-destructive">{errors.file.message}</p>}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">{Math.round(uploadProgress || 0)}%</p>
            </div>
          )}

          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? 'Upload en cours...' : 'Uploader'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;