import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CreditCard,
  Receipt,
  Settings,
  Shield,
  Ticket,
  Users,
} from "lucide-react";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import AdminAccountingTab from "../components/AdminAccountingTab";
import AdminRegistrationsTab from "../components/AdminRegistrationsTab";
import AdminShareholdersTab from "../components/AdminShareholdersTab";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

export default function AdminDashboardPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <Shield className="h-3 w-3" />
            Admin Dashboard
          </div>
          <h1 className="font-display text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage shareholders, event registrations, and accounting records for
            Sound Waves Publishing &amp; Media.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="shareholders">
          <TabsList className="border border-border bg-muted/50">
            <TabsTrigger
              value="shareholders"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              Shareholders
            </TabsTrigger>
            <TabsTrigger
              value="registrations"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Ticket className="h-4 w-4" />
              Event Registrations
            </TabsTrigger>
            <TabsTrigger
              value="accounting"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Receipt className="h-4 w-4" />
              Accounting Log
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.settings.tab"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shareholders" className="mt-6">
            <AdminShareholdersTab />
          </TabsContent>
          <TabsContent value="registrations" className="mt-6">
            <AdminRegistrationsTab />
          </TabsContent>
          <TabsContent value="accounting" className="mt-6">
            <AdminAccountingTab />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <Card className="border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Settings
                </CardTitle>
                <CardDescription>
                  Manage Stripe API keys, test mode, and subscription statistics
                  for Sound Waves Publishing &amp; Media.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configure your Stripe integration to enable real payment
                    processing for memberships, event registrations, and share
                    purchases. View active subscriber counts and revenue
                    summaries from the settings page.
                  </p>
                  <Button
                    onClick={() => navigate({ to: "/admin/settings" })}
                    className="gap-2"
                    data-ocid="admin.settings.primary_button"
                  >
                    <Settings className="h-4 w-4" />
                    Manage Payment Settings
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
