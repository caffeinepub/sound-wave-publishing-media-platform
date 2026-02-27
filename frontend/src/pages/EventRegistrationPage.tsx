import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateEventRegistration } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Ticket, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TICKET_PRICE_DOLLARS = 25;

export default function EventRegistrationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const createRegistration = useCreateEventRegistration();

  const totalDollars = (quantity * TICKET_PRICE_DOLLARS).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (quantity < 1) {
      setError('Please select at least 1 ticket.');
      return;
    }

    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const result = await createRegistration.mutateAsync({
        attendeeName: name.trim(),
        email: email.trim(),
        ticketQuantity: quantity,
        successUrl: `${baseUrl}/event-registration-success`,
        cancelUrl: `${baseUrl}/event-registration-failure`,
      });

      if (!result?.url) {
        throw new Error('Payment session URL is missing. Please try again.');
      }

      window.location.href = result.url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <Ticket className="h-3 w-3" />
            Event Registration
          </div>
          <h1 className="font-display text-4xl font-bold">Register for Our Event</h1>
          <p className="text-muted-foreground">
            Secure your tickets for the Sound Waves Publishing &amp; Media event.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Form */}
          <div className="md:col-span-3">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Attendee Information</CardTitle>
                <CardDescription>Enter your details to register</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Number of Tickets *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">${TICKET_PRICE_DOLLARS}.00 per ticket</p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    disabled={createRegistration.isPending}
                  >
                    {createRegistration.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Proceed to Payment — ${totalDollars}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card className="border-border bg-card sticky top-24">
              <CardHeader>
                <CardTitle className="font-display text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ticket Price</span>
                    <span>${TICKET_PRICE_DOLLARS}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span>{quantity}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary text-lg">${totalDollars}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Secure Payment</p>
                  <p>Powered by Stripe. Your payment information is encrypted and secure.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
