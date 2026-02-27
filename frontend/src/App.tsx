import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, useLocation } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsStripeConfigured, useIsMerchantServicesConfigured, useIsNationalBankcardConfigured, useIsCallerAdmin } from './hooks/useQueries';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import StripeSetupDialog from './components/StripeSetupDialog';
import MerchantServicesSetupDialog from './components/MerchantServicesSetupDialog';
import NationalBankcardSetupDialog from './components/NationalBankcardSetupDialog';
import HomePage from './pages/HomePage';
import MediaDetailPage from './pages/MediaDetailPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import ArtistDashboard from './pages/ArtistDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import EmbedVideoPage from './pages/EmbedVideoPage';
import CheckoutHandoffPage from './pages/CheckoutHandoffPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminBookkeepingPage from './pages/AdminBookkeepingPage';
import AdminUserRolesPage from './pages/AdminUserRolesPage';
import EventRegistrationPage from './pages/EventRegistrationPage';
import EventRegistrationSuccessPage from './pages/EventRegistrationSuccessPage';
import EventRegistrationFailurePage from './pages/EventRegistrationFailurePage';
import ArtistPortalPage from './pages/ArtistPortalPage';
import SharePurchaseSuccessPage from './pages/SharePurchaseSuccessPage';
import SharePurchaseFailurePage from './pages/SharePurchaseFailurePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const queryClient = new QueryClient();

function RootLayout() {
  const location = useLocation();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: stripeConfigured, isLoading: stripeLoading } = useIsStripeConfigured();
  const { data: merchantConfigured, isLoading: merchantLoading } = useIsMerchantServicesConfigured();
  const { data: nationalBankcardConfigured, isLoading: nationalBankcardLoading } = useIsNationalBankcardConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showStripeSetup =
    isAuthenticated && isAdmin && !stripeLoading && !merchantLoading && !nationalBankcardLoading && !stripeConfigured && !merchantConfigured && !nationalBankcardConfigured;

  const isEmbedRoute = location.pathname.startsWith('/embed/');

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

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const mediaDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/media/$mediaId', component: MediaDetailPage });
const artistProfileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/artist/$artistId', component: ArtistProfilePage });
const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dashboard', component: ArtistDashboard });
const paymentSuccessRoute = createRoute({ getParentRoute: () => rootRoute, path: '/payment-success', component: PaymentSuccess });
const paymentFailureRoute = createRoute({ getParentRoute: () => rootRoute, path: '/payment-failure', component: PaymentFailure });
const embedVideoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/embed/video/$mediaId', component: EmbedVideoPage });
const checkoutHandoffRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout/handoff', component: CheckoutHandoffPage });
const adminAnalyticsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/analytics', component: AdminAnalyticsPage });
const adminBookkeepingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/bookkeeping', component: AdminBookkeepingPage });
const adminUserRolesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/user-roles', component: AdminUserRolesPage });

// New Sound Waves routes
const eventRegistrationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/event-registration', component: EventRegistrationPage });
const eventRegistrationSuccessRoute = createRoute({ getParentRoute: () => rootRoute, path: '/event-registration-success', component: EventRegistrationSuccessPage });
const eventRegistrationFailureRoute = createRoute({ getParentRoute: () => rootRoute, path: '/event-registration-failure', component: EventRegistrationFailurePage });
const artistPortalRoute = createRoute({ getParentRoute: () => rootRoute, path: '/artist-portal', component: ArtistPortalPage });
const sharePurchaseSuccessRoute = createRoute({ getParentRoute: () => rootRoute, path: '/share-purchase-success', component: SharePurchaseSuccessPage });
const sharePurchaseFailureRoute = createRoute({ getParentRoute: () => rootRoute, path: '/share-purchase-failure', component: SharePurchaseFailurePage });
const adminDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/dashboard', component: AdminDashboardPage });

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
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
