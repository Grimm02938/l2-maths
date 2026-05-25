import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useLoginModal } from "../hooks/use-login-modal";
import { Mail, Lock, AlertCircle, Check } from "lucide-react";

interface RegisterFormProps {
  onSwitch: () => void;
}

export function RegisterForm({ onSwitch }: RegisterFormProps) {
  const { close } = useLoginModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordStrength = {
    hasLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumbers: /\d/.test(password),
  };

  const isStrong = Object.values(passwordStrength).filter(Boolean).length >= 2;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      close();
    } catch (error: any) {
      console.error("Register Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé.");
      } else if (error.code === 'auth/weak-password') {
        setError("Le mot de passe doit être plus solide.");
      } else {
        setError("Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && isStrong && !loading;

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2.5">
        <Label htmlFor="register-email" className="text-sm font-medium">
          Email
        </Label>
        <div className={`relative transition-all duration-200 ${emailFocused ? 'ring-2 ring-primary/30 rounded-lg' : ''}`}>
          <Mail className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${emailFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <Input
            id="register-email"
            type="email"
            placeholder="adresse@email.com"
            className="pl-10 bg-background/60 border-border/50 rounded-lg transition-all focus:bg-background focus:border-primary/50 focus:ring-0"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="register-password" className="text-sm font-medium">
          Mot de passe
        </Label>
        <div className={`relative transition-all duration-200 ${passwordFocused ? 'ring-2 ring-primary/30 rounded-lg' : ''}`}>
          <Lock className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${passwordFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••••"
            className="pl-10 bg-background/60 border-border/50 rounded-lg transition-all focus:bg-background focus:border-primary/50 focus:ring-0"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="new-password"
            required
            disabled={loading}
          />
        </div>

        {password && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <p className="text-xs text-muted-foreground">Force du mot de passe:</p>
            <div className="grid grid-cols-3 gap-2">
              <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition-all ${passwordStrength.hasLength ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Check className="h-3 w-3" />
                <span>6+ caractères</span>
              </div>
              <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition-all ${passwordStrength.hasUpperCase ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Check className="h-3 w-3" />
                <span>Majuscule</span>
              </div>
              <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition-all ${passwordStrength.hasNumbers ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Check className="h-3 w-3" />
                <span>Chiffre</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
        disabled={!isFormValid}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Création...
          </span>
        ) : (
          "Créer mon compte"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground/70">Ou</span>
        </div>
      </div>

      <p className="text-center text-sm">
        <span className="text-muted-foreground">Déjà un compte ? </span>
        <Button 
          type="button" 
          variant="link" 
          onClick={onSwitch} 
          className="h-auto p-0 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Se connecter
        </Button>
      </p>
    </form>
  );
}
