import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLoginModal } from '@/hooks/use-login-modal';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { GraduationCap, User, LogOut, Mail, Upload } from 'lucide-react';
import React, { useState } from 'react';

export const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { open: openLoginModal } = useLoginModal();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {children} {/* This will render the SidebarTrigger */}
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">L2 MATHS</span>
                <span className="block text-xs text-muted-foreground">Explorer</span>
              </div>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <Link to="/contact">
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </Link>
            {user ? (
              <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden md:block text-sm max-w-[140px] truncate">
                      {user.displayName || user.email}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="border-l border-border bg-card w-64 px-0 py-0"
                >
                  <div className="flex flex-col h-full">
                    <div className="px-4 py-5 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.displayName || 'Utilisateur'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 px-2 py-2">
                      <SheetClose asChild>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">Profil</span>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          to="/upload"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">Téléverser</span>
                        </Link>
                      </SheetClose>
                    </div>

                    <div className="px-2 py-2 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" onClick={openLoginModal}>
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
