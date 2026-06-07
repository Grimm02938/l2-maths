import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLoginModal } from '@/hooks/use-login-modal';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Archive, BookOpenText, GraduationCap, LogOut, Mail, NotebookPen, Search, Upload, User } from 'lucide-react';
import React, { useState } from 'react';

const navItems = [
  { to: '/', label: 'Archives', icon: Archive },
  { to: '/blog', label: 'Logbook', icon: NotebookPen },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { open: openLoginModal } = useLoginModal();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/72 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          {children}
          <Link to="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_30px_hsl(var(--primary)/0.16)]">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary))]" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-black uppercase tracking-[0.28em] text-foreground sm:text-base">L2 Maths</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">archive engine</span>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/45 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-[0_0_22px_hsl(var(--primary)/0.2)]'
                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden rounded-full border border-border/60 bg-card/40 sm:inline-flex" aria-label="Recherche">
            <Search className="h-4 w-4" />
          </Button>

          {user ? (
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden max-w-[140px] truncate text-sm md:block">
                    {user.displayName || user.email}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-l border-border bg-background/95 px-0 py-0 backdrop-blur-2xl">
                <div className="flex h-full flex-col">
                  <div className="border-b border-border px-5 py-6">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Session active</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{user.displayName || 'Utilisateur'}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 px-2 py-3">
                    <SheetClose asChild>
                      <Link to="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/80">
                        <User className="h-4 w-4 text-muted-foreground" /> Profil
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/upload" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/80">
                        <Upload className="h-4 w-4 text-muted-foreground" /> Televerser
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/80">
                        <BookOpenText className="h-4 w-4 text-muted-foreground" /> Bibliotheque
                      </Link>
                    </SheetClose>
                  </div>

                  <div className="border-t border-border px-2 py-3">
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10">
                      <LogOut className="h-4 w-4" /> Deconnexion
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button onClick={openLoginModal} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Connexion</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
