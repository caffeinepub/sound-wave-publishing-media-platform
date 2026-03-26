import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Eye,
  EyeOff,
  Loader2,
  Settings,
  Shield,
  Users,
  Wifi,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

function SecretInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10 bg-muted/30 border-border/60 font-mono text-sm"
        data-ocid={`${id}.input`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide" : "Show"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { actor, isFetching: actorFetching } = useActor();

  const [publishableKey, setPublishableKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [allowedCountries, setAllowedCountries] = useState("US,CA,GB");
  const [testResult, setTestResult] = useState<"success" | "error" | null>(
    null,
  );

  const { isLoading: settingsLoading } = useQuery({
    queryKey: ["adminStripeSettings"],
    queryFn: async () => {
      if (!actor) return null;
      const a = actor as any;
      const result = await a.getAdminStripeSettings();
      if (result.length > 0) {
        const s = result[0];
        setPublishableKey(s.publishableKey);
        setSecretKey(s.secretKey);
        setWebhookSecret(s.webhookSecret);
        setTestMode(s.testMode);
        setAllowedCountries(s.allowedCountries.join(","));
        return s;
      }
      return null;
    },
    enabled: !!actor && !actorFetching && !!isAdmin,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["subscriptionStats"],
    queryFn: async () => {
      if (!actor) return null;
      const a2 = actor as any;
      return a2.getSubscriptionStats();
    },
    enabled: !!actor && !actorFetching && !!isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const a3 = actor as any;
      await a3.setAdminStripeSettings({
        publishableKey,
        secretKey,
        webhookSecret,
        testMode,
        allowedCountries: allowedCountries
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      });
    },
    onSuccess: () => toast.success("Settings saved successfully"),
    onError: () => toast.error("Failed to save settings"),
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.isStripeConfigured();
    },
    onSuccess: (configured) => {
      setTestResult(configured ? "success" : "error");
      if (configured) {
        toast.success("Stripe connection verified successfully!");
      } else {
        toast.error("Stripe is not configured. Please check your keys.");
      }
    },
    onError: () => {
      setTestResult("error");
      toast.error("Connection test failed. Please check your keys.");
    },
  });

  const isAuthenticated = !!identity;

  if (isInitializing || profileLoading || adminLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen variant="login-required" />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen variant="unauthorized" />;
  }

  const formatCurrency = (val: bigint) => `$${(Number(val) / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <Shield className="h-3 w-3" />
            Admin Settings
          </div>
          <h1 className="font-display text-4xl font-bold">Payment Settings</h1>
          <p className="text-muted-foreground">
            Configure Stripe API keys, webhook integration, and monitor
            subscription statistics for Sound Waves Publishing &amp; Media.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Security Warning */}
        <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-200">
          <AlertTriangle className="h-4 w-4 !text-amber-400" />
          <AlertDescription className="text-amber-200">
            <strong className="text-amber-100">Security Notice:</strong> Stripe
            API keys are stored in the canister&apos;s stable memory and are
            accessible to node operators. Never share these keys publicly. Use
            environment-scoped keys and rotate them regularly.
          </AlertDescription>
        </Alert>

        {/* Subscription Stats */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Subscription Statistics
            </CardTitle>
            <CardDescription>
              Live membership and revenue data for Sound Waves Publishing &amp;
              Media.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div
                className="flex items-center gap-2 text-muted-foreground"
                data-ocid="stats.loading_state"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading statistics...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Active Subscribers
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats
                      ? Number(stats.activeSubscribers).toLocaleString()
                      : "—"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <Users className="h-3 w-3" />
                    Members
                  </div>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Monthly Revenue
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats ? formatCurrency(stats.monthlyRevenue) : "—"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <DollarSign className="h-3 w-3" />
                    This month
                  </div>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats ? formatCurrency(stats.totalRevenue) : "—"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <DollarSign className="h-3 w-3" />
                    All time
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stripe API Keys */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Stripe API Configuration
                </CardTitle>
                <CardDescription>
                  Enter your Stripe API keys to enable payment processing. Get
                  your keys from the{" "}
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Stripe Dashboard
                  </a>
                  .
                </CardDescription>
              </div>
              <Badge
                variant={testMode ? "secondary" : "default"}
                className={
                  testMode
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }
              >
                {testMode ? "Test Mode" : "Live Mode"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {settingsLoading ? (
              <div
                className="flex items-center gap-2 text-muted-foreground"
                data-ocid="settings.loading_state"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading settings...
              </div>
            ) : (
              <>
                {/* Publishable Key */}
                <div className="space-y-2">
                  <Label
                    htmlFor="publishable_key"
                    className="text-sm font-medium"
                  >
                    Stripe Publishable Key
                  </Label>
                  <SecretInput
                    id="publishable_key"
                    value={publishableKey}
                    onChange={setPublishableKey}
                    placeholder={testMode ? "pk_test_..." : "pk_live_..."}
                  />
                  <p className="text-xs text-muted-foreground">
                    Starts with <code className="text-primary">pk_test_</code>{" "}
                    (test) or <code className="text-primary">pk_live_</code>{" "}
                    (live)
                  </p>
                </div>

                {/* Secret Key */}
                <div className="space-y-2">
                  <Label htmlFor="secret_key" className="text-sm font-medium">
                    Stripe Secret Key
                  </Label>
                  <SecretInput
                    id="secret_key"
                    value={secretKey}
                    onChange={setSecretKey}
                    placeholder={testMode ? "sk_test_..." : "sk_live_..."}
                  />
                  <p className="text-xs text-muted-foreground">
                    Starts with <code className="text-primary">sk_test_</code>{" "}
                    (test) or <code className="text-primary">sk_live_</code>{" "}
                    (live). Keep this secret.
                  </p>
                </div>

                {/* Webhook Secret */}
                <div className="space-y-2">
                  <Label
                    htmlFor="webhook_secret"
                    className="text-sm font-medium"
                  >
                    Webhook Secret Key
                  </Label>
                  <SecretInput
                    id="webhook_secret"
                    value={webhookSecret}
                    onChange={setWebhookSecret}
                    placeholder="whsec_..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Found in your Stripe Dashboard under Webhooks. Configure
                    your webhook URL to point to your canister&apos;s{" "}
                    <code className="text-primary">/api/stripe-webhook</code>{" "}
                    endpoint.
                  </p>
                </div>

                {/* Allowed Countries */}
                <div className="space-y-2">
                  <Label
                    htmlFor="allowed_countries"
                    className="text-sm font-medium"
                  >
                    Allowed Countries
                  </Label>
                  <Input
                    id="allowed_countries"
                    value={allowedCountries}
                    onChange={(e) => setAllowedCountries(e.target.value)}
                    placeholder="US,CA,GB"
                    className="bg-muted/30 border-border/60"
                    data-ocid="allowed_countries.input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated ISO country codes (e.g. US, CA, GB, AU)
                  </p>
                </div>

                {/* Test Mode Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="test_mode" className="text-sm font-medium">
                      Test Mode (Sandbox)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable Stripe test mode (sandbox). Disable for live
                      payments.
                    </p>
                  </div>
                  <Switch
                    id="test_mode"
                    checked={testMode}
                    onCheckedChange={setTestMode}
                    data-ocid="test_mode.switch"
                  />
                </div>

                {/* Test result feedback */}
                {testResult && (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                      testResult === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                        : "bg-destructive/10 border border-destructive/30 text-destructive"
                    }`}
                    data-ocid={
                      testResult === "success"
                        ? "connection.success_state"
                        : "connection.error_state"
                    }
                  >
                    {testResult === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {testResult === "success"
                      ? "Connection verified — Stripe is properly configured."
                      : "Connection failed — please check your API keys."}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => testMutation.mutate()}
                    disabled={!secretKey || testMutation.isPending}
                    className="gap-2"
                    data-ocid="test_connection.button"
                  >
                    {testMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wifi className="h-4 w-4" />
                    )}
                    Test Connection
                  </Button>
                  <Button
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="gap-2"
                    data-ocid="save_settings.primary_button"
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {saveMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Webhook Setup Guide */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Webhook Setup Guide</CardTitle>
            <CardDescription>
              Configure your Stripe webhook to receive payment confirmations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <a
                  href="https://dashboard.stripe.com/webhooks"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  Stripe Dashboard → Webhooks
                </a>
              </li>
              <li>Click &ldquo;Add endpoint&rdquo;</li>
              <li>
                Set the URL to your canister endpoint (e.g.,{" "}
                <code className="rounded bg-muted/40 px-1 text-xs text-foreground">
                  https://your-canister.ic0.app/api/stripe-webhook
                </code>
                )
              </li>
              <li>
                Select events:{" "}
                <code className="rounded bg-muted/40 px-1 text-xs text-foreground">
                  checkout.session.completed
                </code>
                ,{" "}
                <code className="rounded bg-muted/40 px-1 text-xs text-foreground">
                  customer.subscription.updated
                </code>
              </li>
              <li>
                Copy the &ldquo;Signing secret&rdquo; and paste it into the
                Webhook Secret field above
              </li>
              <li>Save settings to apply</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
