import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { contactService } from "@/lib/firebase-database";
import { storageService } from "@/lib/firebase-storage";
import toast from "react-hot-toast";
import { useModal } from "@/providers/modal-provider";
import { Send, Loader2, UploadCloud, File as FileIcon, X } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide." }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
});

export function ContactForm() {
  const { closeModal } = useModal();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (files.length > 5) {
        toast.error("Tu peux envoyer jusqu'a 5 images maximum.");
        return;
      }

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length !== files.length) {
        toast.error("Seules les images sont acceptees.");
        return;
      }

      const uploadResults = await Promise.all(
        imageFiles.map((file) => {
          const validation = storageService.validateFile(file);
          if (!validation.valid) {
            throw new Error(validation.error || "Fichier invalide.");
          }
          return storageService.uploadFile(file, `contact-images/${Date.now()}`);
        })
      );

      await contactService.addContactMessage({
        ...values,
        imageUrls: uploadResults.map((result) => result.url),
      });

      toast.success("Message envoyé avec succès !");
      setFiles([]);
      closeModal();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi.");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 bg-gray-900 rounded-lg">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Votre email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="nom@exemple.com"
                  {...field} 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Votre message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Laissez votre message ici..."
                  {...field} 
                  className="bg-gray-800 border-gray-700 text-white h-32 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel className="text-gray-300">Joindre des images (optionnel)</FormLabel>
          <label
            htmlFor="contact-images-upload"
            className="border border-dashed border-gray-700 rounded-md p-4 text-center cursor-pointer hover:border-primary transition-colors block"
          >
            <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
            <p className="mt-2 text-xs text-gray-400">Clique pour selectionner des images</p>
            <Input
              id="contact-images-upload"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          {files.length > 0 && (
            <div className="space-y-2 mt-2">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-md p-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-300 truncate">{file.name}</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFile(index)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi en cours...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" />Envoyer le message</>
          )}
        </Button>
      </form>
    </Form>
  );
}
