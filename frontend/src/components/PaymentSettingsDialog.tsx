import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Settings, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import {
  useIsStripeConfigured,
  useIsMerchantServicesConfigured,
  useIsNationalBankcardConfigured,
  useSetStripeConfiguration,
  useSetMerchantServicesConfiguration,
  useSetNationalBankcardConfiguration,
  useIsCallerAdmin,
} from '../hooks/useQueries';

export default function PaymentSettingsDialog() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: stripeConfigured } = useIsStripeConfigured();
  const { data: merchantConfigured } = useIsMerchantServicesConfigured();
  const { data: nationalBankcardConfigured } = useIsNationalBankcardConfigured();
  const setStripeConfig = useSetStripeConfiguration();
  const setMerchantConfig = useSetMerchantServicesConfiguration();
  const setNationalBankcardConfig = useSetNationalBankcardConfiguration();

  const [open, setOpen] = useState(false);
  const [stripeKey, setStripeKey] = useState('');
  const [stripeCountries, setStripeCountries] = useState('US,CA,GB,AU,DE,FR,ES,IT,NL,SE');
  const [apiLoginId, setApiLoginId] = useState('');
  const [transactionKey, setTransactionKey] = useState('');
  const [endpoint, setEndpoint] = useState('https://apitest.authorize.net/xml/v1/request.api');
  const [merchantCountries, setMerchantCountries] = useState('US,CA,GB,AU,DE,FR,ES,IT,NL,SE');
  const [merchantId, setMerchantId] = useState('');
  const [nationalApiKey, setNationalApiKey] = useState('');
  const [nationalEndpoint, setNationalEndpoint] = useState('https://api.nationalbankcard.com/v1');
  const [nationalCountries, setNationalCountries] = useState('US,CA,GB,AU,DE,FR,ES,IT,NL,SE');

  if (!isAdmin) return null;

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const allowedCountries = stripeCountries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 2);

    try {
      await setStripeConfig.mutateAsync({
        secretKey: stripeKey.trim(),
        allowedCountries,
      });
      toast.success('Stripe configured successfully!');
      setStripeKey('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to configure Stripe');
    }
  };

  const handleMerchantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiLoginId.trim() || !transactionKey.trim()) {
      toast.error('Please enter your API Login ID and Transaction Key');
      return;
    }

    const allowedCountries = merchantCountries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 2);

    try {
      await setMerchantConfig.mutateAsync({
        apiLoginId: apiLoginId.trim(),
        transactionKey: transactionKey.trim(),
        endpoint: endpoint.trim(),
        allowedCountries,
      });
      toast.success('Merchant Services configured successfully!');
      setApiLoginId('');
      setTransactionKey('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to configure Merchant Services');
    }
  };

  const handleNationalBankcardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId.trim() || !nationalApiKey.trim()) {
      toast.error('Please enter your Merchant ID and API Key');
      return;
    }

    const allowedCountries = nationalCountries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 2);

    try {
      await setNationalBankcardConfig.mutateAsync({
        merchantId: merchantId.trim(),
        apiKey: nationalApiKey.trim(),
        endpoint: nationalEndpoint.trim(),
        allowedCountries,
      });
      toast.success('National Bankcard configured successfully!');
      setMerchantId('');
      setNationalApiKey('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to configure National Bankcard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Payment Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Gateway Configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Gateways Status</CardTitle>
              <CardDescription>Configure payment methods for your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Stripe</span>
                </div>
                {stripeConfigured ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Not Configured
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Merchant Services (Authorize.net)</span>
                </div>
                {merchantConfigured ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Not Configured
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">National Bankcard</span>
                </div>
                {nationalBankcardConfigured ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Not Configured
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Stripe Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stripe Configuration</CardTitle>
              <CardDescription>Configure Stripe payment processing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStripeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripeKey">Stripe Secret Key</Label>
                  <Input
                    id="stripeKey"
                    type="password"
                    placeholder="sk_test_... or sk_live_..."
                    value={stripeKey}
                    onChange={(e) => setStripeKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripeCountries">Allowed Countries (comma-separated)</Label>
                  <Input
                    id="stripeCountries"
                    placeholder="US,CA,GB,AU,DE,FR"
                    value={stripeCountries}
                    onChange={(e) => setStripeCountries(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Use 2-letter ISO country codes</p>
                </div>
                <Button type="submit" disabled={setStripeConfig.isPending}>
                  {setStripeConfig.isPending ? 'Saving...' : stripeConfigured ? 'Update Stripe' : 'Configure Stripe'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Merchant Services Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Merchant Services Configuration</CardTitle>
              <CardDescription>Configure Authorize.net payment processing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMerchantSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiLoginId">API Login ID</Label>
                  <Input
                    id="apiLoginId"
                    type="text"
                    placeholder="Your API Login ID"
                    value={apiLoginId}
                    onChange={(e) => setApiLoginId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionKey">Transaction Key</Label>
                  <Input
                    id="transactionKey"
                    type="password"
                    placeholder="Your Transaction Key"
                    value={transactionKey}
                    onChange={(e) => setTransactionKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input
                    id="endpoint"
                    type="text"
                    placeholder="https://apitest.authorize.net/xml/v1/request.api"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Use test endpoint for sandbox, production for live</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="merchantCountries">Allowed Countries (comma-separated)</Label>
                  <Input
                    id="merchantCountries"
                    placeholder="US,CA,GB,AU,DE,FR"
                    value={merchantCountries}
                    onChange={(e) => setMerchantCountries(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Use 2-letter ISO country codes</p>
                </div>
                <Button type="submit" disabled={setMerchantConfig.isPending}>
                  {setMerchantConfig.isPending
                    ? 'Saving...'
                    : merchantConfigured
                      ? 'Update Merchant Services'
                      : 'Configure Merchant Services'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* National Bankcard Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">National Bankcard Configuration</CardTitle>
              <CardDescription>Configure National Bankcard payment processing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNationalBankcardSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="merchantId">Merchant ID</Label>
                  <Input
                    id="merchantId"
                    type="text"
                    placeholder="Your Merchant ID"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalApiKey">API Key</Label>
                  <Input
                    id="nationalApiKey"
                    type="password"
                    placeholder="Your API Key"
                    value={nationalApiKey}
                    onChange={(e) => setNationalApiKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalEndpoint">API Endpoint</Label>
                  <Input
                    id="nationalEndpoint"
                    type="text"
                    placeholder="https://api.nationalbankcard.com/v1"
                    value={nationalEndpoint}
                    onChange={(e) => setNationalEndpoint(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Use test endpoint for sandbox, production for live</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalCountries">Allowed Countries (comma-separated)</Label>
                  <Input
                    id="nationalCountries"
                    placeholder="US,CA,GB,AU,DE,FR"
                    value={nationalCountries}
                    onChange={(e) => setNationalCountries(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Use 2-letter ISO country codes</p>
                </div>
                <Button type="submit" disabled={setNationalBankcardConfig.isPending}>
                  {setNationalBankcardConfig.isPending
                    ? 'Saving...'
                    : nationalBankcardConfigured
                      ? 'Update National Bankcard'
                      : 'Configure National Bankcard'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
