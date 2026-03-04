import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Home, Ticket } from "lucide-react";

export default function EventRegistrationSuccessPage() {
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
            Registration Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your event registration has been successfully processed. Check your
            email for confirmation details.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">What's Next?</p>
          <p>
            You'll receive a confirmation email with your ticket details and
            event information.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate({ to: "/artist-portal" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Ticket className="mr-2 h-4 w-4" />
            Visit Artist Portal
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
