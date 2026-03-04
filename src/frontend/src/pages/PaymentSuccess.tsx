import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRecordEvent } from "../hooks/useQueries";
import {
  buildUrlWithPersistedParams,
  getPersistedUrlParameter,
} from "../utils/urlParams";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const recordEvent = useRecordEvent();
  const hasRecorded = useRef(false);

  useEffect(() => {
    // Ensure ref parameter is persisted
    getPersistedUrlParameter("ref");

    // Record analytics event
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      const ref = getPersistedUrlParameter("ref");
      recordEvent.mutate({
        eventType: "payment_success_view",
        ref: ref,
        mediaId: null,
      });
    }
  }, [recordEvent.mutate]);

  const handleBrowseMore = () => {
    navigate({ to: buildUrlWithPersistedParams("/", ["ref"]) as "/" });
  };

  const handleGoToDashboard = () => {
    navigate({
      to: buildUrlWithPersistedParams("/dashboard", ["ref"]) as "/dashboard",
    });
  };

  return (
    <div className="container flex min-h-[600px] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Your license purchase has been completed successfully. You will
            receive a confirmation email shortly.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={handleBrowseMore}>Browse More Works</Button>
            <Button variant="outline" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
