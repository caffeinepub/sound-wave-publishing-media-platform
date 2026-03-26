import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Loader2, Music, Star, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const MONTHLY_PERKS = [
  "Full access to all 8 art discipline galleries",
  "Upload & license your creative works",
  "Copyright registration support",
  "Artist profile with custom portfolio",
  "ElasticStage.com profile integration",
  "Community access & networking",
];

const ANNUAL_PERKS = [
  "Everything in Monthly membership",
  "Save $20 per year vs. monthly billing",
  "Priority placement in artist galleries",
  "Early access to new platform features",
  "Dedicated account support",
  "Exclusive annual member badge",
];

export default function MembershipPage() {
  const { actor, isFetching } = useActor();
  const navigate = useNavigate();
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [loadingAnnual, setLoadingAnnual] = useState(false);

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    if (!actor) {
      toast.error("Please log in to subscribe.");
      return;
    }

    const isMonthly = plan === "monthly";
    isMonthly ? setLoadingMonthly(true) : setLoadingAnnual(true);

    try {
      const item = isMonthly
        ? {
            productName: "Monthly Artist Membership",
            productDescription:
              "Sound Waves Publishing & Media monthly membership",
            priceInCents: 1000n,
            quantity: 1n,
            currency: "usd",
          }
        : {
            productName: "Annual Artist Membership",
            productDescription:
              "Sound Waves Publishing & Media annual membership \u2013 save $20",
            priceInCents: 10000n,
            quantity: 1n,
            currency: "usd",
          };

      const url = await actor.createCheckoutSession(
        [item],
        `${window.location.origin}/membership/success`,
        `${window.location.origin}/membership/failure`,
      );
      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Unable to start checkout. Please try again.");
      isMonthly ? setLoadingMonthly(false) : setLoadingAnnual(false);
    }
  };

  return (
    <div className="min-h-screen py-16" data-ocid="membership.page">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
              <Music className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-5xl font-bold text-primary">
            Artist Membership
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join Sound Waves Publishing &amp; Media and showcase your creativity
            to the world. <em>Where Music and Art Meet Legacy.</em>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {/* Monthly Card */}
          <Card
            className="relative border-border bg-card flex flex-col"
            data-ocid="membership.monthly.card"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Monthly
                </span>
              </div>
              <CardTitle className="font-display text-4xl font-bold">
                $10
                <span className="text-xl font-normal text-muted-foreground">
                  /month
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Flexible month-to-month access to all artist features.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {MONTHLY_PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{perk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={loadingMonthly || isFetching}
                onClick={() => handleSubscribe("monthly")}
                data-ocid="membership.monthly.submit_button"
              >
                {loadingMonthly ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to Stripe&hellip;
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe Monthly
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Annual Card */}
          <Card
            className="relative border-primary/50 bg-card flex flex-col ring-1 ring-primary/20"
            data-ocid="membership.annual.card"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs font-bold uppercase tracking-widest">
                <Star className="mr-1 h-3 w-3" /> Best Value
              </Badge>
            </div>
            <CardHeader className="pb-4 pt-8">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Annual
                </span>
              </div>
              <CardTitle className="font-display text-4xl font-bold">
                $100
                <span className="text-xl font-normal text-muted-foreground">
                  /year
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                ~$8.33/month &mdash; save $20 compared to monthly billing.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {ANNUAL_PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{perk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={loadingAnnual || isFetching}
                onClick={() => handleSubscribe("annual")}
                data-ocid="membership.annual.submit_button"
              >
                {loadingAnnual ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to Stripe&hellip;
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe Annually
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Payments are securely processed by Stripe. Cancel anytime. By
          subscribing you agree to our Terms of Service.
        </p>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            data-ocid="membership.home.link"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
