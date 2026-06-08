import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLoginModal } from '@/hooks/use-login-modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

const AuthModal = () => {
  const { isOpen, close } = useLoginModal();
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => setIsRegistering(!isRegistering);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
          setTimeout(() => setIsRegistering(false), 200);
        }
      }}
    >
      <DialogContent className="overflow-hidden border-border/60 bg-background p-0 sm:max-w-4xl">
        <div className="grid min-h-[560px] md:grid-cols-[0.95fr_1.05fr]">
          <aside className="hidden flex-col justify-between border-r border-border/60 bg-gradient-to-br from-primary/15 via-background to-background p-8 md:flex">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                Accès sécurisé
              </Badge>
              <div className="space-y-3">
                <DialogTitle className="text-3xl">
                  {isRegistering ? 'Crée ton compte' : 'Reviens sur le site'}
                </DialogTitle>
                <DialogDescription className="max-w-sm text-base">
                  {isRegistering
                    ? 'Inscris-toi pour garder tes infos et accéder plus vite aux ressources.'
                    : 'Connecte-toi pour retrouver tes documents, tes favoris et tes échanges.'}
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 p-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Connexion simple et rapide
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 p-3">
                <BookOpen className="h-4 w-4 text-primary" />
                Accès aux ressources du site
              </div>
            </div>
          </aside>

          <div className="space-y-6 p-6 sm:p-8">
            <DialogHeader className="text-left">
              <Badge variant="outline" className="w-fit">
                {isRegistering ? 'Inscription' : 'Connexion'}
              </Badge>
              <DialogTitle className="text-2xl">
                {isRegistering ? 'Créer un compte' : 'Connexion ultra simple'}
              </DialogTitle>
              <DialogDescription>
                {isRegistering
                  ? 'Quelques secondes suffisent pour rejoindre le site.'
                  : 'Entre tes identifiants pour continuer.'}
              </DialogDescription>
            </DialogHeader>

            {isRegistering ? (
              <RegisterForm onSwitch={toggleForm} />
            ) : (
              <LoginForm onSwitch={toggleForm} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
