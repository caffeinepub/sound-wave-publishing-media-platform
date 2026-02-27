import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { useGetMedia, useGetArtistProfile, useCreateUnifiedCheckoutSession, useIsStripeConfigured, useIsMerchantServicesConfigured, useIsNationalBankcardConfigured } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { MediaType, PaymentMethod } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, Music, Image as ImageIcon, Video, FileText, ShoppingCart, User, CreditCard, Info } from 'lucide-react';
import { getPersistedUrlParameter } from '../utils/urlParams';
import type { LicensingOption, ShoppingItem, CheckoutRequest } from '../backend';

export default function MediaDetailPage() {
  const { mediaId } = useParams({ from: '/media/$mediaId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: media, isLoading } = useGetMedia(mediaId);
  const { data: artist } = useGetArtistProfile(media?.artistId);
  const { data: stripeConfigured } = useIsStripeConfigured();
  const { data: merchantConfigured } = useIsMerchantServicesConfigured();
  const { data: nationalBankcardConfigured } = useIsNationalBankcardConfigured();
  const createCheckout = useCreateUnifiedCheckoutSession();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'merchantServices' | 'nationalBankcard'>('stripe');
  const [referralSource, setReferralSource] = useState<string | null>(null);

  useEffect(() => {
    const ref = getPersistedUrlParameter('ref');
    if (ref) {
      setReferralSource(ref);
    }
  }, []);

  const getMediaIcon = () => {
    if (!media) return null;
    switch (media.mediaType) {
      case MediaType.music:
        return <Music className="h-6 w-6" />;
      case MediaType.image:
        return <ImageIcon className="h-6 w-6" />;
      case MediaType.video:
        return <Video className="h-6 w-6" />;
      case MediaType.text:
        return <FileText className="h-6 w-6" />;
    }
  };

  const handlePurchase = async (license: LicensingOption) => {
    if (!identity) {
      toast.error('Please login to purchase a license');
      return;
    }

    if (!media) return;

    const items: ShoppingItem[] = [
      {
        productName: `${media.title} - ${license.name}`,
        productDescription: license.description,
        priceInCents: license.price,
        quantity: BigInt(1),
        currency: 'usd',
      },
    ];

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    
    let paymentMethod: PaymentMethod;
    if (selectedPaymentMethod === 'stripe') {
      paymentMethod = PaymentMethod.stripe;
    } else if (selectedPaymentMethod === 'merchantServices') {
      paymentMethod = PaymentMethod.merchantServices;
    } else {
      paymentMethod = PaymentMethod.nationalBankcard;
    }

    const request: CheckoutRequest = {
      buyerId: identity.getPrincipal().toString(),
      items,
      successUrl: `${baseUrl}/payment-success`,
      cancelUrl: `${baseUrl}/payment-failure`,
      paymentMethod,
    };

    try {
      const response = await createCheckout.mutateAsync(request);
      
      if (response.paymentMethod === PaymentMethod.stripe && response.sessionId) {
        // For Stripe, parse the session and redirect
        const session = JSON.parse(response.sessionId) as { id: string; url: string };
        if (!session?.url) {
          throw new Error('Stripe session missing url');
        }
        window.location.href = session.url;
      } else if (response.paymentMethod === PaymentMethod.merchantServices) {
        // For Merchant Services, handle client-side (currently not fully implemented in backend)
        toast.info('Merchant Services checkout coming soon. Please use Stripe for now.');
      } else if (response.paymentMethod === PaymentMethod.nationalBankcard) {
        // For National Bankcard, handle client-side (currently not fully implemented in backend)
        toast.info('National Bankcard checkout coming soon. Please use Stripe for now.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create checkout session');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="aspect-video rounded-lg bg-muted" />
          <div className="h-6 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">Media not found</p>
              <Button className="mt-4" onClick={() => navigate({ to: '/' })}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasPaymentGateways = stripeConfigured || merchantConfigured || nationalBankcardConfigured;
  const availableGateways = [
    stripeConfigured && { value: 'stripe', label: 'Stripe', icon: CreditCard },
    merchantConfigured && { value: 'merchantServices', label: 'Merchant Services', icon: CreditCard },
    nationalBankcardConfigured && { value: 'nationalBankcard', label: 'National Bankcard', icon: CreditCard },
  ].filter(Boolean) as Array<{ value: string; label: string; icon: any }>;

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gallery
      </Button>

      {/* Referral Banner */}
      {referralSource === 'elasticstage' && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You arrived from ElasticStage (external third-party site)
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Media Preview */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {media.mediaType === MediaType.image ? (
                <img
                  src={media.fileReference.getDirectURL()}
                  alt={media.title}
                  className="h-full w-full object-contain"
                />
              ) : media.mediaType === MediaType.video ? (
                <video src={media.fileReference.getDirectURL()} controls className="h-full w-full" />
              ) : media.mediaType === MediaType.music ? (
                <div className="flex h-full items-center justify-center">
                  <audio src={media.fileReference.getDirectURL()} controls className="w-full max-w-md" />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </Card>

          {/* Details */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{media.title}</CardTitle>
                  <Badge variant="secondary" className="mt-2 gap-1">
                    {getMediaIcon()}
                    {media.mediaType.charAt(0).toUpperCase() + media.mediaType.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-muted-foreground">{media.description}</p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">Copyright Information</h3>
                <p className="text-sm text-muted-foreground">{media.copyrightInfo}</p>
              </div>
            </CardContent>
          </Card>

          {/* Artist Info */}
          {artist && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">About the Artist</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="flex cursor-pointer items-start gap-4 transition-opacity hover:opacity-80"
                  onClick={() => navigate({ to: '/artist/$artistId', params: { artistId: artist.id } })}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{artist.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Licensing Options */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Licensing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {media.licensingOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No licensing options available</p>
              ) : (
                <>
                  {/* Payment Method Selection */}
                  {hasPaymentGateways && availableGateways.length > 1 && (
                    <div className="space-y-3 rounded-lg border p-4">
                      <Label className="text-sm font-medium">Payment Method</Label>
                      <RadioGroup
                        value={selectedPaymentMethod}
                        onValueChange={(value) => setSelectedPaymentMethod(value as 'stripe' | 'merchantServices' | 'nationalBankcard')}
                      >
                        {availableGateways.map((gateway) => (
                          <div key={gateway.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={gateway.value} id={gateway.value} />
                            <Label htmlFor={gateway.value} className="flex cursor-pointer items-center gap-2 font-normal">
                              <gateway.icon className="h-4 w-4" />
                              {gateway.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* License Cards */}
                  {media.licensingOptions.map((license) => (
                    <Card key={license.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <h4 className="font-semibold">{license.name}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{license.description}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground">Terms: {license.terms}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">${(Number(license.price) / 100).toFixed(2)}</span>
                          <Button
                            onClick={() => handlePurchase(license)}
                            disabled={createCheckout.isPending || !hasPaymentGateways}
                            size="sm"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {createCheckout.isPending ? 'Processing...' : 'Purchase'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {!hasPaymentGateways && (
                    <p className="text-xs text-muted-foreground">
                      Payment processing is not yet configured. Please contact the administrator.
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
