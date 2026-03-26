import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Home, Music } from "lucide-react";
import { useEffect, useRef } from "react";
import { useActor } from "../hooks/useActor";

export default function MembershipSuccessPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const recorded = useRef(false);

  useEffect(() => {
    if (!actor || recorded.current) return;
    recorded.current = true;

    actor
      .createMembershipFeeRecord(
        "guest",
        1000n,
        "Membership fee paid via Stripe checkout",
      )
      .catch((err: unknown) => {
        console.error("Failed to record membership fee:", err);
      });
  }, [actor]);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-16"
      data-ocid="membership.success_state"
    >
      <div className="container max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-primary">
            Welcome, Artist!
          </h1>
          <p className="text-muted-foreground">
            Your membership to Sound Waves Publishing &amp; Media has been
            successfully activated. <em>Where Music and Art Meet Legacy.</em>
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground flex items-center justify-center gap-2">
            <Music className="h-4 w-4 text-primary" /> Membership Active
          </p>
          <p>
            You now have full access to all artist features, galleries, and
            tools on the platform.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate({ to: "/artist-portal" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="membership.success.portal.button"
          >
            Go to Artist Portal
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/" })}
            data-ocid="membership.success.home.button"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
