import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LogicPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Logique</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Contenu pour le cours de logique à venir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogicPage;
