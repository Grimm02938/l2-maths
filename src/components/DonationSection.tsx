import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Loader2 } from 'lucide-react';
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
      // Appeler la Cloud Function pour créer l'intention de paiement
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 'https://europe-west1-l2-maths.cloudfunctions.net'}/createDonationIntent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Montant en centimes
            email,
            name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const { clientSecret } = await response.json();

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
        <label className="text-sm font-medium mb-3 block">
          Sélectionnez un montant
        </label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {predefinedAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleAmountClick(value)}
              className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                amount === value && !customAmount
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {value}€
            </button>
          ))}
        </div>

        {/* Montant personnalisé */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
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
              className="flex-1"
            />
            <span className="text-sm font-medium">€</span>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Nom</label>
          <Input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Élément carte */}
      <div>
        <label className="text-sm font-medium mb-2 block">Détails de la carte</label>
        <div className="p-3 border rounded-lg bg-card">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  '::placeholder': {
                    color: '#aab7c4',
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

      <p className="text-xs text-muted-foreground text-center">
        Votre don nous aide à maintenir et améliorer cette archive de cours.
      </p>
    </form>
  );
};

export const DonationSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-12 border-t bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Soutenez ce projet
          </h2>
          <p className="text-muted-foreground">
            Une contribution pour nous aider à maintenir cette archive de cours
          </p>
        </div>

        {isExpanded ? (
          <div className="bg-card rounded-lg p-6 border shadow-lg">
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
