import { useState, useCallback } from 'react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';
import { useLoginModal } from '../hooks/use-login-modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Lock, Mail, Zap, ArrowRight } from 'lucide-react';

const LoginModal = () => {
  const { isOpen, close } = useLoginModal();
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = useCallback(() => {
    setIsLoginView((current) => !current);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="overflow-hidden border-border/40 bg-background p-0 sm:max-w-5xl shadow-2xl">
        <div className="grid min-h-[600px] md:grid-cols-2 gap-0">
          {/* Left side - Visual */}
          <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-background p-10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20" />

            <div className="relative space-y-8">
              <div>
                <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/25 border-0 transition-all">
                  <Zap className="h-3 w-3 mr-1.5" />
                  Accès instant
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight mb-3">
                  {isLoginView ? 'Bienvenue' : 'Rejoins nous'}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                  {isLoginView
                    ? 'Retrouve tous tes documents, tes notes et tes progrès en un seul endroit.'
                    : 'Crée ton compte en quelques secondes pour accéder à tout le contenu.'}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3 group cursor-default">
                  <div className="mt-1 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sécurisé</p>
                    <p className="text-xs text-muted-foreground">Chiffrage de bout en bout</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group cursor-default">
                  <div className="mt-1 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Simple</p>
                    <p className="text-xs text-muted-foreground">Email et mot de passe</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40" />
                {isLoginView ? 'Nouveau ici ?' : 'Déjà inscrit ?'}
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-col justify-between p-8 md:p-10">
            {/* Header */}
            <div className="space-y-3 mb-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {isLoginView ? '🔑 Connexion' : '✨ Inscription'}
                </p>
                <h3 className="text-3xl font-bold tracking-tight">
                  {isLoginView ? 'Bon retour' : 'Crée ton compte'}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {isLoginView
                  ? 'Entre tes identifiants pour continuer.'
                  : 'Choisis un mot de passe solide.'}
              </p>
            </div>

            {/* Form */}
            <div className="flex-1">
              {isLoginView ? (
                <LoginForm onSwitch={toggleView} />
              ) : (
                <RegisterForm onSwitch={toggleView} />
              )}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-6 border-t border-border/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isLoginView ? "Pas encore inscrit ?" : "Déjà un compte ?"}
                </span>
                <button
                  onClick={toggleView}
                  className="flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium transition-colors group"
                >
                  {isLoginView ? 'S\'inscrire' : 'Se connecter'}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
