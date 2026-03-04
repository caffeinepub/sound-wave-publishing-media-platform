import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PaymentMethod } from "../backend";
import type {
  CheckoutRequest,
  LicensingOption,
  ShoppingItem,
} from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateUnifiedCheckoutSession,
  useGetMedia,
  useRecordEvent,
} from "../hooks/useQueries";
import {
  buildUrlWithPersistedParams,
  getPersistedUrlParameter,
} from "../utils/urlParams";

export default function CheckoutHandoffPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/checkout/handoff" });
  const { identity, login, loginStatus } = useInternetIdentity();
  const createCheckout = useCreateUnifiedCheckoutSession();
  const recordEvent = useRecordEvent();
  const hasRecorded = useRef(false);

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAttemptedCheckout, setHasAttemptedCheckout] = useState(false);

  // Extract query params
  const mediaId = (searchParams as any).mediaId as string | undefined;
  const licenseId = (searchParams as any).licenseId as string | undefined;
  const paymentMethodParam = (searchParams as any).paymentMethod as
    | string
    | undefined;

  // Fetch media data
  const {
    data: media,
    isLoading: mediaLoading,
    error: mediaError,
  } = useGetMedia(mediaId);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  // Persist referral parameter on mount and record analytics event
  useEffect(() => {
    getPersistedUrlParameter("ref");
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      const ref = getPersistedUrlParameter("ref");
      recordEvent.mutate({
        eventType: "checkout_handoff_view",
        ref: ref,
        mediaId: mediaId || null,
      });
    }
  }, [mediaId, recordEvent.mutate]);

  // Auto-start checkout after successful login
  useEffect(() => {
    if (
      isAuthenticated &&
      !hasAttemptedCheckout &&
      !isProcessing &&
      media &&
      licenseId
    ) {
      initiateCheckout();
    }
  }, [isAuthenticated, hasAttemptedCheckout, isProcessing, media, licenseId]);

  const initiateCheckout = async () => {
    if (!media || !licenseId || !identity) return;

    setIsProcessing(true);
    setHasAttemptedCheckout(true);

    try {
      // Find the licensing option
      const license = media.licensingOptions.find(
        (opt: LicensingOption) => opt.id === licenseId,
      );

      if (!license) {
        setError("Invalid license option selected");
        setIsProcessing(false);
        return;
      }

      // Build shopping items
      const items: ShoppingItem[] = [
        {
          productName: `${media.title} - ${license.name}`,
          productDescription: license.description,
          priceInCents: license.price,
          quantity: BigInt(1),
          currency: "usd",
        },
      ];

      // Determine payment method
      let paymentMethod: PaymentMethod = PaymentMethod.stripe;
      if (paymentMethodParam === "merchantServices") {
        paymentMethod = PaymentMethod.merchantServices;
      } else if (paymentMethodParam === "nationalBankcard") {
        paymentMethod = PaymentMethod.nationalBankcard;
      }

      const baseUrl = `${window.location.protocol}//${window.location.host}`;

      // Build return URLs with persisted ref parameter
      const successUrl = `${baseUrl}${buildUrlWithPersistedParams("/payment-success", ["ref"])}`;
      const cancelUrl = `${baseUrl}${buildUrlWithPersistedParams("/payment-failure", ["ref"])}`;

      const request: CheckoutRequest = {
        buyerId: identity.getPrincipal().toString(),
        items,
        successUrl,
        cancelUrl,
        paymentMethod,
      };

      const response = await createCheckout.mutateAsync(request);

      // Handle Stripe redirect
      if (
        response.paymentMethod === PaymentMethod.stripe &&
        response.sessionId
      ) {
        const session = JSON.parse(response.sessionId) as {
          id: string;
          url: string;
        };
        if (!session?.url) {
          throw new Error("Stripe session missing url");
        }
        // Redirect to Stripe checkout
        window.location.href = session.url;
      } else if (response.paymentMethod === PaymentMethod.merchantServices) {
        toast.info(
          "Merchant Services checkout coming soon. Please use Stripe for now.",
        );
        setIsProcessing(false);
      } else if (response.paymentMethod === PaymentMethod.nationalBankcard) {
        toast.info(
          "National Bankcard checkout coming soon. Please use Stripe for now.",
        );
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to create checkout session");
      setIsProcessing(false);
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Failed to login. Please try again.");
    }
  };

  const handleBackToGallery = () => {
    navigate({ to: buildUrlWithPersistedParams("/", ["ref"]) as "/" });
  };

  // Validation errors
  if (!mediaId || !licenseId) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Invalid Checkout Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              The checkout link is missing required information. Please use a
              valid checkout link or browse the gallery to select a work.
            </p>
            <Button onClick={handleBackToGallery} className="w-full">
              Back to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading media
  if (mediaLoading) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardContent className="flex min-h-[200px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading checkout...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Media not found or invalid license
  if (!media || mediaError) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Work Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              The work you're trying to purchase could not be found. It may have
              been removed or the link is invalid.
            </p>
            <Button onClick={handleBackToGallery} className="w-full">
              Back to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const license = media.licensingOptions.find(
    (opt: LicensingOption) => opt.id === licenseId,
  );
  if (!license) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Invalid License Option</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              The license option you selected is not available for this work.
            </p>
            <Button onClick={handleBackToGallery} className="w-full">
              Back to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <LogIn className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Login Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              You need to be logged in to purchase a license. Please login to
              continue with your purchase.
            </p>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">{media.title}</p>
              <p className="text-sm text-muted-foreground">{license.name}</p>
              <p className="mt-2 text-lg font-bold">
                ${(Number(license.price) / 100).toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login to Purchase
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToGallery}
                className="w-full"
              >
                Back to Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Processing checkout or error state
  if (isProcessing || error) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {error ? (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <CardTitle className="text-2xl">Checkout Error</CardTitle>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <CardTitle className="text-2xl">Processing Checkout</CardTitle>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {error ? (
              <>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={handleBackToGallery} className="w-full">
                  Back to Gallery
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">
                Please wait while we redirect you to the payment page...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback (should not reach here normally)
  return (
    <div className="container flex min-h-[600px] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Preparing checkout...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
