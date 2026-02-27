import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { getPersistedUrlParameter, buildUrlWithPersistedParams } from '../utils/urlParams';
import { useRecordEvent } from '../hooks/useQueries';

export default function PaymentFailure() {
  const navigate = useNavigate();
  const recordEvent = useRecordEvent();
  const hasRecorded = useRef(false);

  useEffect(() => {
    // Ensure ref parameter is persisted
    getPersistedUrlParameter('ref');
    
    // Record analytics event
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      const ref = getPersistedUrlParameter('ref');
      recordEvent.mutate({
        eventType: 'payment_failure_view',
        ref: ref,
        mediaId: null,
      });
    }
  }, []);

  const handleBrowseWorks = () => {
    navigate({ to: buildUrlWithPersistedParams('/', ['ref']) as '/' });
  };

  return (
    <div className="container flex min-h-[600px] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={handleBrowseWorks}>Browse Works</Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
