import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
);

interface DonationFormProps {
  onSuccess?: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const predefinedAmounts = [5, 10, 25, 50];

  const handleAmountClick = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setAmount(parseFloat(value) || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe non chargé');
      return;
    }

    if (amount < 1) {
      toast.error('Veuillez entrer un montant supérieur à 1€');
      return;
    }

    if (!email || !name) {
      toast.error('Veuillez remplir vos informations');
      return;
    }

    setIsLoading(true);

    try {
      // Appeler la Cloud Function pour creer l'intention de paiement
      const functionUrl = import.meta.env.VITE_DONATION_FUNCTION_URL || 'https://createdonationintent-hgbaakmcna-ew.a.run.app';

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Montant en centimes
          email,
          name,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création du paiement';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data: { clientSecret?: string };
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('Réponse invalide du serveur');
      }

      const { clientSecret } = data;

      if (!clientSecret) {
        throw new Error('Pas de client secret reçu');
      }

      // Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Élément carte non trouvé');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email,
              name,
            },
          },
        }
      );

      if (error) {
        toast.error(`Erreur: ${error.message}`);
      } else if (paymentIntent?.status === 'succeeded') {
        toast.success('Merci pour votre don! ❤️');
        // Réinitialiser le formulaire
        setAmount(10);
        setCustomAmount('');
        setEmail('');
        setName('');
        setIsLoading(false);
        elements.getElement(CardElement)?.clear();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Montants prédéfinis */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/90 mb-3 block">
          Sélectionnez un montant
        </label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {predefinedAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleAmountClick(value)}
              className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                amount === value && !customAmount
                  ? 'bg-primary text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary))]'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60'
              }`}
            >
              {value}€
            </button>
          ))}
        </div>

        {/* Montant personnalisé */}
        <div>
          <label className="text-xs text-slate-300/85 mb-2 block uppercase tracking-[0.15em]">
            Ou entrez un montant personnalisé
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              step="0.01"
              placeholder="Montant en €"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="flex-1 bg-slate-900/70 border-cyan-200/20 focus-visible:ring-cyan-300/40"
            />
            <span className="text-sm font-medium text-cyan-100">€</span>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/90 mb-1 block">Nom</label>
          <Input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background/70 border-border/80 focus-visible:ring-ring/50"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/90 mb-1 block">Email</label>
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/70 border-border/80 focus-visible:ring-ring/50"
            required
          />
        </div>
      </div>

      {/* Élément carte */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/90 mb-2 block">Détails de la carte</label>
        <div className="p-3 border border-border/80 rounded-lg bg-background/70">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#f4f4f5',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Bouton submit */}
      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <Heart className="w-4 h-4 mr-2" />
            Donner {amount}€
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Votre don aide a maintenir les ressources, publier de nouveaux contenus et ameliorer le site.
      </p>
    </form>
  );
};

export const DonationSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-14 border-t border-border/60 bg-background">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-2 font-['Space_Grotesk',sans-serif]">
            <Heart className="w-6 h-6 text-primary" />
            Soutenez ce projet
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Une contribution pour garder une archive de maths claire, moderne et utile a tous les etudiants.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border/70 rounded-full px-3 py-1.5 bg-card/60">
            <ShieldCheck className="w-3.5 h-3.5" /> Paiement securise via Stripe
          </p>
        </div>

        {isExpanded ? (
          <div className="rounded-2xl p-6 border border-border/70 bg-card/70 shadow-[0_16px_42px_rgba(0,0,0,0.32)] backdrop-blur-sm">
            <Elements stripe={stripePromise}>
              <DonationForm onSuccess={() => setIsExpanded(false)} />
            </Elements>
          </div>
        ) : (
          <Button
            onClick={() => setIsExpanded(true)}
            size="lg"
            className="w-full"
            variant="outline"
          >
            Faire un don
          </Button>
        )}
      </div>
    </section>
  );
};
