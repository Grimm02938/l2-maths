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
import { Archive, BookMarked, LogOut, Mail, NotebookPen, Search, Upload, User } from 'lucide-react';
import React, { useState } from 'react';

const navItems = [
  { to: '/', label: 'Archive' },
  { to: '/#garden', label: 'Garden' },
  { to: '/blog', label: 'Logbook' },
  { to: '/contact', label: 'Contact' },
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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          {children}
          <Link to="/" className="group flex items-center gap-3 transition-opacity hover:opacity-85">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background font-display text-lg font-bold text-primary">
              ∑
            </div>
            <div className="leading-tight">
              <span className="block font-ui text-[11px] font-bold uppercase tracking-[0.32em] text-muted-foreground">Adame Archive</span>
              <span className="block font-display text-lg font-semibold tracking-tight text-foreground">L2 Maths</span>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active = item.to === '/' ? location.pathname === '/' : location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`archive-link font-ui text-[12px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden rounded-full border border-border bg-background/45 sm:inline-flex" aria-label="Recherche">
            <Search className="h-4 w-4" />
          </Button>

          {user ? (
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-full border border-border bg-background/45 px-2.5 font-ui">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden max-w-[140px] truncate text-sm md:block">
                    {user.displayName || user.email}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-l border-border bg-card px-0 py-0">
                <div className="flex h-full flex-col font-ui">
                  <div className="border-b border-border px-5 py-6">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Espace personnel</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary">
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
                      <Link to="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/70">
                        <User className="h-4 w-4 text-muted-foreground" /> Profil
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/upload" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/70">
                        <Upload className="h-4 w-4 text-muted-foreground" /> Téléverser
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/70">
                        <BookMarked className="h-4 w-4 text-muted-foreground" /> Bibliothèque
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/blog" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/70">
                        <NotebookPen className="h-4 w-4 text-muted-foreground" /> Logbook
                      </Link>
                    </SheetClose>
                  </div>

                  <div className="border-t border-border px-2 py-3">
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10">
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button onClick={openLoginModal} className="rounded-full bg-foreground px-4 font-ui text-background hover:bg-foreground/88">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Connexion</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
