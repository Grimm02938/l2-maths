import { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Logique de téléversement ici
    // ...
    // Simule une attente pour la démo
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`${fileName} a été téléversé avec succès !`);
    setIsSubmitting(false);
    setFileName('');
    // Réinitialiser le formulaire si nécessaire
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="text-3xl font-bold text-white mt-4">Partager un document</CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Contribuez à la communauté en ajoutant de nouvelles ressources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sélecteur de matière */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-300">Matière</label>
                    <Select name="subject">
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Choisir une matière..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {/* Remplacer par les vraies données */}
                        <SelectItem value="alg_lin">Algèbre Linéaire</SelectItem>
                        <SelectItem value="analyse">Analyse</SelectItem>
                        <SelectItem value="arithmetique">Arithmétique</SelectItem>
                        <SelectItem value="topologie">Topologie</SelectItem>
                        <SelectItem value="calc_num">Calcul Numérique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sélecteur de type de document */}
                  <div className="space-y-2">
                    <label htmlFor="docType" className="text-sm font-medium text-gray-300">Type de document</label>
                    <Select name="docType">
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Choisir un type..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="cours">Cours</SelectItem>
                        <SelectItem value="td">TD</SelectItem>
                        <SelectItem value="correction-td">Correction de TD</SelectItem>
                        <SelectItem value="ds">DS</SelectItem>
                        <SelectItem value="correction-ds">Correction de DS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Champ Identifiant du chapitre */}
                <div className="space-y-2">
                  <label htmlFor="chapterId" className="text-sm font-medium text-gray-300">Identifiant du chapitre</label>
                  <Input 
                    id="chapterId" 
                    name="chapterId"
                    placeholder="Ex: a1, e2, t3..."
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                {/* Zone de téléversement de fichier */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Fichier</label>
                  <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleFileChange}
                      accept=".pdf"
                      required
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-10 w-10 text-gray-500" />
                      {fileName ? (
                        <p className="text-white font-semibold">{fileName}</p>
                      ) : (
                        <p className="text-gray-400">
                          <span className="font-semibold text-primary">Cliquez pour choisir</span> ou glissez-déposez
                        </p>
                      )}
                      <p className="text-xs text-gray-500">PDF uniquement, 10MB max</p>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full font-bold text-lg py-6 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Téléversement en cours...</span>
                    </>
                  ) : (
                    <span>Envoyer le document</span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
