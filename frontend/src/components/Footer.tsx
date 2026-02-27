import { Music } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'sound-waves-publishing');

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span className="font-display text-base font-bold text-primary">Sound Waves Publishing & Media</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A premier music publishing and media company dedicated to empowering artists and protecting creative works.
            </p>
            <p className="text-xs text-muted-foreground">
              Founded by <span className="text-primary font-medium">Mr. Robin T. Harding Smith</span>
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/event-registration" className="hover:text-primary transition-colors">Event Registration</a></li>
              <li><a href="/artist-portal" className="hover:text-primary transition-colors">Artist Portal</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legal</h4>
            <p className="text-xs text-muted-foreground">
              © {year} Sound Waves Publishing & Media. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              RTS Enterprises (Research Technological Systems Enterprises) — A privately held for-profit business entity.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Sound Waves Publishing & Media
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Built with <Music className="h-3 w-3 text-primary fill-primary" /> using{' '}
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
