import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLoginModal } from '@/hooks/use-login-modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const AuthModal = () => {
  const { isOpen, close } = useLoginModal();
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => setIsRegistering(!isRegistering);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        close();
        // Reset to login form when closing
        setTimeout(() => setIsRegistering(false), 200);
      }
    }}>
      <DialogContent 
        className="p-0 max-w-4xl flex"
      >
        {/* Left side with a welcoming message and graphic */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-muted/40 text-foreground p-8">
          <h2 className="text-3xl font-bold mb-4">Bienvenue !</h2>
          <p className="text-center">
            {isRegistering
              ? 'Créez votre compte pour accéder à toutes les ressources.'
              : 'Connectez-vous pour retrouver vos cours et exercices.'}
          </p>
          {/* You could add an illustration or logo here */}
        </div>

        {/* Right side with the form */}
        <div className="w-full md:w-1/2 p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            {isRegistering ? 'Inscription' : 'Connexion'}
          </h3>
          {
            isRegistering
              ? <RegisterForm onSwitch={toggleForm} />
              : <LoginForm onSwitch={toggleForm} />
          }
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
