import { cn } from "@/lib/utils";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { Button } from "../ui/button";
import { useModal } from "@/providers/modal-provider";
import { ContactForm } from "../forms/contact-form";
import { Mail } from "lucide-react";

export function Header() {
  const { openModal } = useModal();

  const handleOpenContactModal = () => {
    openModal({
      title: "Contactez-nous",
      content: <ContactForm />
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button 
            variant="ghost"
            size="icon"
            onClick={handleOpenContactModal}
            aria-label="Contacter le support"
            className="hover:bg-gray-800"
          >
            <Mail className="h-5 w-5 text-gray-400" />
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
