import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, BarChart3, Loader2, TrendingUp } from "lucide-react";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllAnalyticsData, useIsCallerAdmin } from "../hooks/useQueries";

export default function AdminAnalyticsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useGetAllAnalyticsData(isAuthenticated && isAdmin === true);

  // Show loading state while checking authentication/authorization
  if (adminLoading) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login required screen if not authenticated
  if (!isAuthenticated) {
    return <AccessDeniedScreen variant="login-required" />;
  }

  // Show unauthorized screen if authenticated but not admin
  if (!isAdmin) {
    return <AccessDeniedScreen variant="unauthorized" />;
  }

  // Show loading state while fetching analytics data
  if (analyticsLoading) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state if analytics query failed
  if (analyticsError) {
    return (
      <div className="container py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data:{" "}
            {analyticsError instanceof Error
              ? analyticsError.message
              : "Unknown error"}
            . Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Show error state if no data returned
  if (!analyticsData) {
    return (
      <div className="container py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const elasticStageData = analyticsData.refCounts.find(
    (ref) => ref.ref === "elasticstage",
  );
  const allData = analyticsData.refCounts.find((ref) => ref.ref === "all");

  const formatEventType = (eventType: string): string => {
    return eventType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Referral Analytics</h1>
        </div>
        <p className="text-muted-foreground">
          Track referral traffic and conversion metrics across your platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(analyticsData.totalEvents).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All tracked events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ElasticStage Referrals
            </CardTitle>
            <Badge variant="secondary">elasticstage</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {elasticStageData
                ? Number(elasticStageData.total).toLocaleString()
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Events from ElasticStage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Referral Sources
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.refCounts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique referral sources
            </p>
          </CardContent>
        </Card>
      </div>

      {elasticStageData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">elasticstage</Badge>
              ElasticStage Referral Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elasticStageData.events.map((event) => (
                  <TableRow key={event.eventType}>
                    <TableCell className="font-medium">
                      {formatEventType(event.eventType)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(event.count).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {Number(elasticStageData.total).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Referral Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referral Source</TableHead>
                <TableHead className="text-right">Total Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.refCounts
                .filter((ref) => ref.ref !== "all")
                .sort((a, b) => Number(b.total) - Number(a.total))
                .map((refData) => (
                  <TableRow key={refData.ref || "unknown"}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {refData.ref === "elasticstage" && (
                          <Badge variant="secondary">elasticstage</Badge>
                        )}
                        {refData.ref !== "elasticstage" && (
                          <span className="font-medium">
                            {refData.ref || "Direct"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(refData.total).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              {allData && (
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>Overall Total (including missing ref)</TableCell>
                  <TableCell className="text-right">
                    {Number(allData.total).toLocaleString()}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Last updated:{" "}
        {new Date(Number(analyticsData.lastUpdated) / 1000000).toLocaleString()}
      </div>
    </div>
  );
}
