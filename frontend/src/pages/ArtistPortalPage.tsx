import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import {
  useGetArtistPortalProfile,
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import SubmitPieceDialog from '../components/SubmitPieceDialog';
import SharePurchaseForm from '../components/SharePurchaseForm';
import {
  Mic2,
  Music,
  TrendingUp,
  CheckCircle2,
  Clock,
  Star,
  Gift,
  AlertCircle,
  User,
} from 'lucide-react';

const REQUIRED_PIECES = 15;
const MAX_SHARES = 7;

export default function ArtistPortalPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: portalProfile, isLoading: portalLoading, refetch: refetchPortal } = useGetArtistPortalProfile();
  const [submitOpen, setSubmitOpen] = useState(false);

  const isAuthenticated = !!identity;

  if (isInitializing || (isAuthenticated && profileLoading)) {
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

  if (isFetched && userProfile === null) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  const submittedPieces = portalProfile?.submittedPieces ?? 0;
  const isEligible = submittedPieces >= REQUIRED_PIECES;
  const sharesOwned = portalProfile?.sharesOwned ?? 0;
  const qualifiesForFreeShare = portalProfile?.qualifiesForFreeShare ?? false;
  const freeShareClaimed = portalProfile?.freeShareClaimed ?? false;
  const progressPct = Math.min((submittedPieces / REQUIRED_PIECES) * 100, 100);
  const maxPurchasable = Math.max(0, MAX_SHARES - sharesOwned);

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <Mic2 className="h-3 w-3" />
            Artist Portal
          </div>
          <h1 className="font-display text-4xl font-bold">
            Welcome, {userProfile?.name || 'Artist'}
          </h1>
          <p className="text-muted-foreground">
            Manage your musical submissions, track eligibility, and purchase shares in Sound Waves Publishing &amp; Media.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
              <p className="font-medium">{userProfile?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
              <p className="font-medium">{userProfile?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Eligibility Status</p>
              <div>
                {isEligible ? (
                  <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Eligibility
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Shares Owned</p>
              <p className="font-medium text-primary">{sharesOwned} / {MAX_SHARES}</p>
            </div>
          </CardContent>
        </Card>

        {/* Musical Pieces Progress */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Musical Submissions
                </CardTitle>
                <CardDescription className="mt-1">
                  Submit 15 musical pieces to become eligible for share purchases
                </CardDescription>
              </div>
              <Button
                onClick={() => setSubmitOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                Submit Piece
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-primary">
                  {submittedPieces} / {REQUIRED_PIECES} pieces
                </span>
              </div>
              <Progress value={progressPct} className="h-3" />
              {!isEligible && (
                <p className="text-xs text-muted-foreground">
                  {REQUIRED_PIECES - submittedPieces} more piece{REQUIRED_PIECES - submittedPieces !== 1 ? 's' : ''} needed for eligibility
                </p>
              )}
              {isEligible && (
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  You've met the eligibility requirement!
                </p>
              )}
            </div>

            {portalLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading submissions...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Ownership */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Share Ownership
            </CardTitle>
            <CardDescription>
              Sound Waves Publishing &amp; Media — 10,000,000 total shares at $1.00/share
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center space-y-1">
                <p className="text-2xl font-bold text-primary font-display">{sharesOwned}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Shares Owned</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center space-y-1">
                <p className="text-2xl font-bold font-display">${(portalProfile?.totalPaid ?? 0).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Invested</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center space-y-1">
                <p className="text-2xl font-bold font-display">{maxPurchasable}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Can Still Purchase</p>
              </div>
            </div>

            <Separator />

            {/* Free Share Notice */}
            {isEligible && qualifiesForFreeShare && !freeShareClaimed && (
              <Alert className="border-primary/30 bg-primary/10">
                <Gift className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  <strong>Congratulations!</strong> You qualify for 1 free share as one of the first 100 eligible artists.
                  This will be credited automatically when you complete your first share purchase.
                </AlertDescription>
              </Alert>
            )}

            {!isEligible && (
              <Alert className="border-border">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <AlertDescription className="text-muted-foreground">
                  Submit {REQUIRED_PIECES - submittedPieces} more musical piece{REQUIRED_PIECES - submittedPieces !== 1 ? 's' : ''} to unlock share purchases.
                </AlertDescription>
              </Alert>
            )}

            {isEligible && maxPurchasable === 0 && (
              <Alert className="border-primary/30 bg-primary/10">
                <Star className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  You've reached the maximum of {MAX_SHARES} shares. Thank you for your investment in Sound Waves Publishing &amp; Media!
                </AlertDescription>
              </Alert>
            )}

            {/* Share Purchase Form */}
            {isEligible && maxPurchasable > 0 && (
              <SharePurchaseForm
                maxPurchasable={maxPurchasable}
                qualifiesForFreeShare={qualifiesForFreeShare && !freeShareClaimed}
                onSuccess={() => refetchPortal()}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <SubmitPieceDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSuccess={() => refetchPortal()}
      />
    </div>
  );
}
