/**
 * Page de téléversement de documents.
 * Permet aux utilisateurs de téléverser des fichiers PDF pour les différentes matières.
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Listes basées sur le README.md
const subjects = [
  { id: "algebra", name: "Algèbre" },
  { id: "analysis", name: "Analyse" },
  { id: "probabilites", name: "Probabilités" },
  { id: "statistiques", name: "Statistiques" },
  { id: "logique", name: "Logique" },
  { id: "topologie", name: "Topologie" },
  { id: "geometrie", name: "Géométrie" },
  { id: "analyse-numerique", name: "Analyse numérique" },
];

const documentTypes = [
  { id: "cours", name: "Cours" },
  { id: "td", name: "TD" },
  { id: "correction-td", name: "Correction de TD" },
  { id: "ds", name: "DS" },
  { id: "correction-ds", name: "Correction de DS" },
];

const UploadPage = () => {
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !chapter || !docType || !file) {
      alert("Veuillez remplir tous les champs et sélectionner un fichier.");
      return;
    }
    setIsLoading(true);
    // La logique de téléversement sera ajoutée ici
    console.log({ subject, chapter, docType, fileName: file.name });
    setTimeout(() => {
      setIsLoading(false);
      alert("Logique de téléversement non implémentée.");
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Téléverser un document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Matière</Label>
              <Select onValueChange={setSubject} value={subject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">Identifiant du chapitre</Label>
              <Input 
                id="chapter" 
                placeholder="Ex: a1, e2, t3..."
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docType">Type de document</Label>
              <Select onValueChange={setDocType} value={docType}>
                <SelectTrigger id="docType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Fichier (PDF uniquement)</Label>
              <Input 
                id="file" 
                type="file" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Téléversement en cours..." : "Téléverser le document"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
