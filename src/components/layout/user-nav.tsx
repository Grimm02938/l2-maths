import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Upload, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function UserNav() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const userInitial = user.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors outline-none">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`}
              alt={user.displayName || user.email || 'Avatar'}
            />
            <AvatarFallback className="bg-muted text-xs text-muted-foreground">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-card border border-border rounded-xl overflow-hidden p-0"
        align="end"
        forceMount
      >
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground truncate">
            {user.displayName || 'Utilisateur'}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {user.email}
          </p>
        </div>

        <div className="p-1">
          <Link to="/profile">
            <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 hover:bg-accent focus:bg-accent gap-2.5">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Profil</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/upload">
            <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 hover:bg-accent focus:bg-accent gap-2.5">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Téléverser</span>
            </DropdownMenuItem>
          </Link>
        </div>

        <div className="p-1 border-t border-border">
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer rounded-lg px-3 py-2 gap-2.5 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Déconnexion</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
