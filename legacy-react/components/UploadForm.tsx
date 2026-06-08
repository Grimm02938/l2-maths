import { useRef, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FileUp } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const UploadForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const title = file.name.replace(/\.[^/.]+$/, '');
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
        setUploadProgress(null);
        toast({ title: 'Erreur', description: "Échec de l'importation.", variant: 'destructive' });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, 'documents'), {
            title,
            description: '',
            tags: [],
            url: downloadURL,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            createdAt: serverTimestamp(),
          });

          if (inputRef.current) inputRef.current.value = '';
          toast({ title: 'Document importé', description: file.name });
        } catch (error) {
          console.error('Upload finalization error:', error);
          toast({
            title: 'Erreur',
            description: "Le fichier est monté, mais l'enregistrement a échoué.",
            variant: 'destructive',
          });
        } finally {
          setIsUploading(false);
          setUploadProgress(null);
        }
      },
    );
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="neo-button-shape h-11 w-full justify-center"
      >
        <FileUp className="mr-2 h-4 w-4" />
        {isUploading ? 'Importation...' : 'Importer un document'}
      </Button>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress || 0} />
          <p className="text-center text-xs text-muted-foreground">
            {Math.round(uploadProgress || 0)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
