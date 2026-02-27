import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePurchaseShares } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, Gift, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SharePurchaseFormProps {
  maxPurchasable: number;
  qualifiesForFreeShare: boolean;
  onSuccess: () => void;
}

export default function SharePurchaseForm({ maxPurchasable, qualifiesForFreeShare, onSuccess }: SharePurchaseFormProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const purchaseShares = usePurchaseShares();

  const effectiveQuantity = Math.min(quantity, maxPurchasable);
  const paidQuantity = qualifiesForFreeShare ? Math.max(0, effectiveQuantity - 1) : effectiveQuantity;
  const totalDollars = paidQuantity.toFixed(2);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (effectiveQuantity < 1) {
      setError('Please select at least 1 share.');
      return;
    }

    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const result = await purchaseShares.mutateAsync({
        quantity: effectiveQuantity,
        successUrl: `${baseUrl}/share-purchase-success`,
        cancelUrl: `${baseUrl}/share-purchase-failure`,
      });

      if (paidQuantity === 0 || result === null) {
        // Free share only — no payment needed
        onSuccess();
        navigate({ to: '/share-purchase-success' });
        return;
      }

      if (!result?.url) {
        throw new Error('Payment session URL is missing. Please try again.');
      }

      window.location.href = result.url;
    } catch (err: any) {
      setError(err.message || 'Failed to initiate share purchase. Please try again.');
    }
  };

  return (
    <form onSubmit={handlePurchase} className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-sm">Purchase Shares</h3>
      </div>

      {qualifiesForFreeShare && (
        <div className="flex items-center gap-2 rounded-md bg-primary/10 border border-primary/20 px-3 py-2 text-xs text-primary">
          <Gift className="h-3.5 w-3.5 flex-shrink-0" />
          <span>1 free share will be applied to your purchase!</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="share-qty" className="text-sm">
          Number of Shares (max {maxPurchasable})
        </Label>
        <Input
          id="share-qty"
          type="number"
          min={1}
          max={maxPurchasable}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(maxPurchasable, parseInt(e.target.value) || 1)))}
          className="bg-background w-32"
        />
        <p className="text-xs text-muted-foreground">$1.00 per share</p>
      </div>

      <Separator />

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shares requested</span>
          <span>{effectiveQuantity}</span>
        </div>
        {qualifiesForFreeShare && (
          <div className="flex justify-between text-primary">
            <span>Free share credit</span>
            <span>-1</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Paid shares</span>
          <span>{paidQuantity}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-primary">${totalDollars}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        disabled={purchaseShares.isPending}
      >
        {purchaseShares.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : paidQuantity === 0 ? (
          <>
            <Gift className="mr-2 h-4 w-4" />
            Claim Free Share
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Purchase {effectiveQuantity} Share{effectiveQuantity !== 1 ? 's' : ''} — ${totalDollars}
          </>
        )}
      </Button>
    </form>
  );
}
