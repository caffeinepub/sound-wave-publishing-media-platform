import { Music } from "lucide-react";
import { useTranslation } from "../lib/i18n";

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    window.location.hostname || "sound-waves-publishing",
  );
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span className="font-display text-base font-bold text-primary">
                Sound Waves Publishing & Media
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("footer.founded")}{" "}
              <span className="text-primary font-medium">
                Mr. Robin T. Harding Smith
              </span>
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("footer.navigation")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  {t("nav.home")}
                </a>
              </li>
              <li>
                <a
                  href="/event-registration"
                  className="hover:text-primary transition-colors"
                >
                  {t("event.title")}
                </a>
              </li>
              <li>
                <a
                  href="/artist-portal"
                  className="hover:text-primary transition-colors"
                >
                  {t("nav.artistPortal")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("footer.legal")}
            </h4>
            <p className="text-xs text-muted-foreground">
              © {year} Sound Waves Publishing & Media. {t("footer.rights")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("footer.privateHolding")}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Sound Waves Publishing & Media
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {t("footer.builtWith")}{" "}
            <Music className="h-3 w-3 text-primary fill-primary" />{" "}
            {t("footer.using")}{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
