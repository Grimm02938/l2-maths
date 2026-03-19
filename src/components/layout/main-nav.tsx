import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link to="/" className="flex items-center space-x-2">
        <div className="p-2 bg-primary rounded-lg">
           <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg">L2 MATHS</span>
      </Link>
    </nav>
  );
}
