import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useLoginModal } from '../hooks/use-login-modal';
import { LoginForm } from './LoginForm'; // Corrected import
import { RegisterForm } from './RegisterForm';

const LoginModal = () => {
  const { isOpen, close } = useLoginModal();
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = useCallback(() => {
    setIsLoginView((current) => !current);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLoginView ? 'Connexion' : 'Inscription'}</DialogTitle>
          <DialogDescription>
            {isLoginView
              ? "Vous devez être connecté pour accéder à cette ressource."
              : "Créez un compte pour commencer à utiliser nos services."} 
          </DialogDescription>
        </DialogHeader>
        {
          isLoginView ? (
            <LoginForm onSwitch={toggleView} />
          ) : (
            <RegisterForm onSwitch={toggleView} />
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
