import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Mic2,
  Receipt,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";
import { LANGUAGE_LIST, useTranslation } from "../lib/i18n";

function LanguageSwitcher() {
  const { lang, setLang, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-ocid="header.language_switcher.button"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline uppercase text-xs font-semibold tracking-wider">
            {lang}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 max-h-80 overflow-y-auto"
        data-ocid="header.language_switcher.dropdown_menu"
      >
        {LANGUAGE_LIST.map(({ code, nativeName }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLang(code)}
            className={lang === code ? "text-primary font-semibold" : ""}
          >
            <span className="w-6 text-xs uppercase text-muted-foreground font-mono mr-2">
              {code}
            </span>
            {t(`lang.${code}`, nativeName)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  void isLoggingIn;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
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
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/generated/swpm-logo.dim_400x200.png"
            alt="Sound Waves Publishing & Media"
            className="h-8 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold text-primary">
              Sound Waves
            </span>
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              Publishing & Media
            </span>
          </div>
        </button>

        {/* Right side: language switcher + user profile */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 border border-border hover:border-primary/50"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline text-sm">
                    {userProfile.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/artist-portal" })}
                >
                  <Mic2 className="mr-2 h-4 w-4" />
                  {t("nav.artistPortal")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/dashboard" })}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t("nav.mediaDashboard")}
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin/dashboard" })}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      {t("nav.adminDashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin/analytics" })}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      {t("nav.analytics")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin/bookkeeping" })}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      {t("nav.bookkeeping")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin/user-roles" })}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      {t("nav.userRoles")}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleAuth}
                  className="text-destructive focus:text-destructive"
                >
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
