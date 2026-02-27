import { useState } from 'react';
import { useIsCallerAdmin, useIsNationalBankcardConfigured, useSetNationalBankcardConfiguration } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NationalBankcardSetupDialog() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: isConfigured, isLoading: configLoading } = useIsNationalBankcardConfigured();
  const setConfig = useSetNationalBankcardConfiguration();
  const [merchantId, setMerchantId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('https://api.nationalbankcard.com/v1');
  const [countries, setCountries] = useState('US,CA,GB,AU,DE,FR,ES,IT,NL,SE');

  const shouldShow = identity && isAdmin && !configLoading && !isConfigured;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId.trim() || !apiKey.trim()) {
      toast.error('Please enter your Merchant ID and API Key');
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
        merchantId: merchantId.trim(),
        apiKey: apiKey.trim(),
        endpoint: endpoint.trim(),
        allowedCountries,
      });
      toast.success('National Bankcard configured successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to configure National Bankcard');
    }
  };

  if (!shouldShow) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Configure National Bankcard</DialogTitle>
          <DialogDescription>Set up National Bankcard to enable additional payment options.</DialogDescription>
        </DialogHeader>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            You need a National Bankcard merchant account. Get your API credentials from the National Bankcard dashboard.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="merchantId">Merchant ID</Label>
            <Input
              id="merchantId"
              type="text"
              placeholder="Your Merchant ID"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endpoint">API Endpoint</Label>
            <Input
              id="endpoint"
              type="text"
              placeholder="https://api.nationalbankcard.com/v1"
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
            {setConfig.isPending ? 'Configuring...' : 'Configure National Bankcard'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
