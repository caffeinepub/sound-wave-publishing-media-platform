import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MerchantServicesSetupDialog from "./components/MerchantServicesSetupDialog";
import NationalBankcardSetupDialog from "./components/NationalBankcardSetupDialog";
import ProfileSetupDialog from "./components/ProfileSetupDialog";
import StripeSetupDialog from "./components/StripeSetupDialog";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useIsCallerAdmin,
  useIsMerchantServicesConfigured,
  useIsNationalBankcardConfigured,
  useIsStripeConfigured,
} from "./hooks/useQueries";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AdminBookkeepingPage from "./pages/AdminBookkeepingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUserRolesPage from "./pages/AdminUserRolesPage";
import ArtistDashboard from "./pages/ArtistDashboard";
import ArtistPortalPage from "./pages/ArtistPortalPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import CheckoutHandoffPage from "./pages/CheckoutHandoffPage";
import EarningsDashboardPage from "./pages/EarningsDashboardPage";
import EmbedVideoPage from "./pages/EmbedVideoPage";
import EventRegistrationFailurePage from "./pages/EventRegistrationFailurePage";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import EventRegistrationSuccessPage from "./pages/EventRegistrationSuccessPage";
import GalleriesPage from "./pages/GalleriesPage";
import GalleryArtworkDetailPage from "./pages/GalleryArtworkDetailPage";
import GalleryCategoryPage from "./pages/GalleryCategoryPage";
import HomePage from "./pages/HomePage";
import InvestorRelationsPage from "./pages/InvestorRelationsPage";
import MediaDetailPage from "./pages/MediaDetailPage";
import MembershipFailurePage from "./pages/MembershipFailurePage";
import MembershipPage from "./pages/MembershipPage";
import MembershipSuccessPage from "./pages/MembershipSuccessPage";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
import ShareCertificatesPage from "./pages/ShareCertificatesPage";
import ShareMarketplacePage from "./pages/ShareMarketplacePage";
import SharePurchaseFailurePage from "./pages/SharePurchaseFailurePage";
import SharePurchaseSuccessPage from "./pages/SharePurchaseSuccessPage";
import TrademarkGuidePage from "./pages/TrademarkGuidePage";

const queryClient = new QueryClient();

function RootLayout() {
  const location = useLocation();
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { data: stripeConfigured, isLoading: stripeLoading } =
    useIsStripeConfigured();
  const { data: merchantConfigured, isLoading: merchantLoading } =
    useIsMerchantServicesConfigured();
  const {
    data: nationalBankcardConfigured,
    isLoading: nationalBankcardLoading,
  } = useIsNationalBankcardConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showStripeSetup =
    isAuthenticated &&
    isAdmin &&
    !stripeLoading &&
    !merchantLoading &&
    !nationalBankcardLoading &&
    !stripeConfigured &&
    !merchantConfigured &&
    !nationalBankcardConfigured;

  const isEmbedRoute = location.pathname.startsWith("/embed/");

  if (isInitializing || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!isEmbedRoute && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isEmbedRoute && <Footer />}
      {showProfileSetup && <ProfileSetupDialog />}
      {showStripeSetup && <StripeSetupDialog />}
      <MerchantServicesSetupDialog />
      <NationalBankcardSetupDialog />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const mediaDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/media/$mediaId",
  component: MediaDetailPage,
});
const artistProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/artist/$artistId",
  component: ArtistProfilePage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: ArtistDashboard,
});
const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});
const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});
const embedVideoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/embed/video/$mediaId",
  component: EmbedVideoPage,
});
const checkoutHandoffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout/handoff",
  component: CheckoutHandoffPage,
});
const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/analytics",
  component: AdminAnalyticsPage,
});
const adminBookkeepingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/bookkeeping",
  component: AdminBookkeepingPage,
});
const adminUserRolesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/user-roles",
  component: AdminUserRolesPage,
});

// New Sound Waves routes
const eventRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event-registration",
  component: EventRegistrationPage,
});
const eventRegistrationSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event-registration-success",
  component: EventRegistrationSuccessPage,
});
const eventRegistrationFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event-registration-failure",
  component: EventRegistrationFailurePage,
});
const artistPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/artist-portal",
  component: ArtistPortalPage,
});
const sharePurchaseSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/share-purchase-success",
  component: SharePurchaseSuccessPage,
});
const sharePurchaseFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/share-purchase-failure",
  component: SharePurchaseFailurePage,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});
const shareCertificatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shares/certificates",
  component: ShareCertificatesPage,
});
const earningsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shares/earnings",
  component: EarningsDashboardPage,
});
const shareMarketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shares/marketplace",
  component: ShareMarketplacePage,
});
const investorRelationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shares/investor-relations",
  component: InvestorRelationsPage,
});
const trademarkGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal/trademark-guide",
  component: TrademarkGuidePage,
});
const galleriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/galleries",
  component: GalleriesPage,
});
const galleryCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/galleries/$category",
  component: GalleryCategoryPage,
});
const galleryArtworkDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/galleries/$category/$mediaId",
  component: GalleryArtworkDetailPage,
});
const membershipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/membership",
  component: MembershipPage,
});
const membershipSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/membership/success",
  component: MembershipSuccessPage,
});
const membershipFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/membership/failure",
  component: MembershipFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mediaDetailRoute,
  artistProfileRoute,
  dashboardRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  embedVideoRoute,
  checkoutHandoffRoute,
  adminAnalyticsRoute,
  adminBookkeepingRoute,
  adminUserRolesRoute,
  eventRegistrationRoute,
  eventRegistrationSuccessRoute,
  eventRegistrationFailureRoute,
  artistPortalRoute,
  sharePurchaseSuccessRoute,
  sharePurchaseFailureRoute,
  adminDashboardRoute,
  shareCertificatesRoute,
  earningsDashboardRoute,
  shareMarketplaceRoute,
  investorRelationsRoute,
  trademarkGuideRoute,
  galleriesRoute,
  galleryCategoryRoute,
  galleryArtworkDetailRoute,
  membershipRoute,
  membershipSuccessRoute,
  membershipFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
