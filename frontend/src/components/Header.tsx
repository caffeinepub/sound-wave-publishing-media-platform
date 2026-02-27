import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Music, User, LayoutDashboard, BarChart3, Receipt, Users, Menu, X, Shield, Ticket, Mic2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/generated/swpm-logo.dim_400x200.png"
            alt="Sound Waves Publishing & Media"
            className="h-8 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold text-primary">Sound Waves</span>
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">Publishing & Media</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Home
          </button>
          <button
            onClick={() => navigate({ to: '/event-registration' })}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Ticket className="h-4 w-4" />
            Events
          </button>
          <button
            onClick={() => navigate({ to: '/artist-portal' })}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Mic2 className="h-4 w-4" />
            Artist Portal
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate({ to: '/admin/dashboard' })}
              className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Shield className="h-4 w-4" />
              Admin
            </button>
          )}
        </nav>

        {/* Auth Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 border border-border hover:border-primary/50">
                  <User className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline text-sm">{userProfile.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/artist-portal' })}>
                  <Mic2 className="mr-2 h-4 w-4" />
                  Artist Portal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Media Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ to: '/admin/dashboard' })}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/admin/analytics' })}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/admin/bookkeeping' })}>
                      <Receipt className="mr-2 h-4 w-4" />
                      Bookkeeping
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/admin/user-roles' })}>
                      <Users className="mr-2 h-4 w-4" />
                      User Roles
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuth} className="text-destructive focus:text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            <button
              onClick={() => { navigate({ to: '/' }); setMobileOpen(false); }}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Home
            </button>
            <button
              onClick={() => { navigate({ to: '/event-registration' }); setMobileOpen(false); }}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Ticket className="h-4 w-4" /> Events
            </button>
            <button
              onClick={() => { navigate({ to: '/artist-portal' }); setMobileOpen(false); }}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Mic2 className="h-4 w-4" /> Artist Portal
            </button>
            {isAdmin && (
              <button
                onClick={() => { navigate({ to: '/admin/dashboard' }); setMobileOpen(false); }}
                className="flex items-center gap-2 rounded px-3 py-2 text-sm text-primary hover:bg-muted"
              >
                <Shield className="h-4 w-4" /> Admin Dashboard
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
