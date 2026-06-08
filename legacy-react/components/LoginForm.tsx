import { useState } from "react";
import { useLoginModal } from "../hooks/use-login-modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

interface LoginFormProps {
  onSwitch: () => void;
}

export function LoginForm({ onSwitch }: LoginFormProps) {
  const { close } = useLoginModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      close();
    } catch (error) {
      console.error("Login Error:", error);
      setError("Email ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && !loading;

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2.5">
        <Label htmlFor="login-email" className="text-sm font-medium">
          Email
        </Label>
        <div className={`relative transition-all duration-200 ${emailFocused ? 'ring-2 ring-primary/30 rounded-lg' : ''}`}>
          <Mail className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${emailFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <Input
            id="login-email"
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

      <div className="space-y-2.5">
        <Label htmlFor="login-password" className="text-sm font-medium">
          Mot de passe
        </Label>
        <div className={`relative transition-all duration-200 ${passwordFocused ? 'ring-2 ring-primary/30 rounded-lg' : ''}`}>
          <Lock className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${passwordFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••••"
            className="pl-10 bg-background/60 border-border/50 rounded-lg transition-all focus:bg-background focus:border-primary/50 focus:ring-0"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
        disabled={!isFormValid}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Connexion...
          </span>
        ) : (
          "Se connecter"
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
        <span className="text-muted-foreground">Pas encore de compte ? </span>
        <Button 
          type="button" 
          variant="link" 
          onClick={onSwitch} 
          className="h-auto p-0 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          S'inscrire maintenant
        </Button>
      </p>
    </form>
  );
}
