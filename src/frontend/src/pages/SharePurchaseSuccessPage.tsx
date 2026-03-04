import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Home, TrendingUp } from "lucide-react";

export default function SharePurchaseSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="container max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-primary">
            Shares Acquired!
          </h1>
          <p className="text-muted-foreground">
            Your share purchase in Sound Waves Publishing &amp; Media has been
            successfully processed. Welcome to the family!
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">
            You're Now a Shareholder
          </p>
          <p>
            Your shares are recorded and you are now a part-owner of Sound Waves
            Publishing &amp; Media.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate({ to: "/artist-portal" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View My Shares
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: "/" })}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
