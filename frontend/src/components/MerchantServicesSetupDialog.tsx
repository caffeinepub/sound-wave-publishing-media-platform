import { useState } from 'react';
import { useIsCallerAdmin, useIsMerchantServicesConfigured, useSetMerchantServicesConfiguration } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MerchantServicesSetupDialog() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: isConfigured, isLoading: configLoading } = useIsMerchantServicesConfigured();
  const setConfig = useSetMerchantServicesConfiguration();
  const [apiLoginId, setApiLoginId] = useState('');
  const [transactionKey, setTransactionKey] = useState('');
  const [endpoint, setEndpoint] = useState('https://apitest.authorize.net/xml/v1/request.api');
  const [countries, setCountries] = useState('US,CA,GB,AU,DE,FR,ES,IT,NL,SE');

  const shouldShow = identity && isAdmin && !configLoading && !isConfigured;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiLoginId.trim() || !transactionKey.trim()) {
      toast.error('Please enter your API Login ID and Transaction Key');
      return;
    }

    const allowedCountries = countries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 2);

    if (allowedCountries.length === 0) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      await setConfig.mutateAsync({
        apiLoginId: apiLoginId.trim(),
        transactionKey: transactionKey.trim(),
        endpoint: endpoint.trim(),
        allowedCountries,
      });
      toast.success('Merchant Services configured successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to configure Merchant Services');
    }
  };

  if (!shouldShow) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Configure Merchant Services</DialogTitle>
          <DialogDescription>Set up Authorize.net to enable additional payment options.</DialogDescription>
        </DialogHeader>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            You need an Authorize.net merchant account. Get your API credentials from the Authorize.net dashboard.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiLoginId">API Login ID</Label>
            <Input
              id="apiLoginId"
              type="text"
              placeholder="Your API Login ID"
              value={apiLoginId}
              onChange={(e) => setApiLoginId(e.target.value)}
              required
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
              required
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
              required
            />
            <p className="text-xs text-muted-foreground">Use test endpoint for sandbox, production for live</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              placeholder="US,CA,GB,AU,DE,FR"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Use 2-letter ISO country codes</p>
          </div>
          <Button type="submit" className="w-full" disabled={setConfig.isPending}>
            {setConfig.isPending ? 'Configuring...' : 'Configure Merchant Services'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
