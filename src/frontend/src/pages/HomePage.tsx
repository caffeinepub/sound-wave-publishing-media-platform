import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Camera,
  ChevronRight,
  Feather,
  Film,
  Mic2,
  Music,
  Music2,
  Palette,
  Scissors,
  Shield,
  Star,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "../lib/i18n";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const HOME_CATEGORIES = [
    {
      key: "narrativeArts",
      label: t("cat.narrativeArts"),
      Icon: BookOpen,
      image: "/assets/generated/category-narrative-arts.dim_400x400.jpg",
    },
    {
      key: "poetry",
      label: t("cat.poetry"),
      Icon: Feather,
      image: "/assets/generated/category-poetry.dim_400x400.jpg",
    },
    {
      key: "photography",
      label: t("cat.photography"),
      Icon: Camera,
      image: "/assets/generated/category-photography.dim_400x400.jpg",
    },
    {
      key: "artDesigns",
      label: t("cat.artDesigns"),
      Icon: Palette,
      image: "/assets/generated/category-art-designs.dim_400x400.jpg",
    },
    {
      key: "artsAndCrafts",
      label: t("cat.artsAndCrafts"),
      Icon: Scissors,
      image: "/assets/generated/category-arts-crafts.dim_400x400.jpg",
    },
    {
      key: "cinemaCreation",
      label: t("cat.cinemaCreation"),
      Icon: Film,
      image: "/assets/generated/category-cinema.dim_400x400.jpg",
    },
    {
      key: "musicalWorks",
      label: t("cat.musicalWorks"),
      Icon: Music,
      image: "/assets/generated/category-musical-works.dim_400x400.jpg",
    },
    {
      key: "scoreSheets",
      label: t("cat.scoreSheets"),
      Icon: Music2,
      image: "/assets/generated/category-score-sheets.dim_400x400.jpg",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bg.dim_1440x600.png')",
          }}
        />
        <div className="absolute inset-0 bg-background/75" />
        <div className="relative container py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
              <Music className="h-3 w-3" />
              {t("home.hero.badge")}
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
              {t("home.hero.headline")}{" "}
              <span className="text-primary">
                {t("home.hero.headlineHighlight")}
              </span>
            </h1>
            <p className="font-serif-body text-lg italic text-primary/90">
              {t("home.hero.tagline")}
            </p>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t("home.hero.subtitle")}
            </p>
            <p className="text-sm text-muted-foreground/70 italic">
              {t("home.hero.founder")}{" "}
              <span className="text-primary not-italic font-semibold">
                Mr. Robin T. Harding Smith
              </span>
              , {t("home.hero.founderTitle")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                onClick={() => navigate({ to: "/event-registration" })}
              >
                <Ticket className="mr-2 h-5 w-5" />
                {t("home.hero.registerBtn")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 font-semibold px-8"
                onClick={() => navigate({ to: "/artist-portal" })}
              >
                <Mic2 className="mr-2 h-5 w-5" />
                {t("home.hero.artistPortalBtn")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                label: t("home.stats.totalShares"),
                value: "10,000,000",
                icon: TrendingUp,
              },
              { label: t("home.stats.sharePrice"), value: "$1.00", icon: Star },
              {
                label: t("home.stats.artistShares"),
                value: "3,000,000",
                icon: Users,
              },
              {
                label: t("home.stats.freeShares"),
                value: t("home.stats.perArtist"),
                icon: Award,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center space-y-1">
                <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="font-display text-2xl font-bold text-primary">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Our Galleries */}
      <section className="py-16 md:py-20" data-ocid="home.galleries_section">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                {t("home.galleries.title")}
              </h2>
              <p className="text-muted-foreground text-sm max-w-md">
                {t("home.galleries.subtitle")}
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden sm:flex border-primary/30 text-primary hover:bg-primary/10 gap-2"
              data-ocid="home.view_all_galleries.button"
              onClick={() => navigate({ to: "/galleries" })}
            >
              {t("home.galleries.viewAll")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {HOME_CATEGORIES.map(({ key, label, Icon, image }, index) => (
              <button
                key={key}
                type="button"
                data-ocid={`home.gallery_category.link.${index + 1}`}
                onClick={() =>
                  navigate({
                    to: "/galleries/$category",
                    params: { category: key },
                  })
                }
                className="group relative overflow-hidden rounded-lg aspect-square bg-card border border-border hover:border-primary/40 hover:shadow-gold transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  src={image}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3">
                  <Icon className="h-4 w-4 text-primary mb-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-semibold text-foreground text-center leading-tight">
                    {label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Button
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
              data-ocid="home.view_all_galleries.button"
              onClick={() => navigate({ to: "/galleries" })}
            >
              {t("home.galleries.viewAll")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-display text-4xl font-bold">
              {t("home.features.title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Ticket,
                title: t("home.features.events.title"),
                description: t("home.features.events.desc"),
                to: "/event-registration" as const,
                cta: t("home.features.events.cta"),
              },
              {
                icon: Mic2,
                title: t("home.features.portal.title"),
                description: t("home.features.portal.desc"),
                to: "/artist-portal" as const,
                cta: t("home.features.portal.cta"),
              },
              {
                icon: Shield,
                title: t("home.features.equity.title"),
                description: t("home.features.equity.desc"),
                to: "/artist-portal" as const,
                cta: t("home.features.equity.cta"),
              },
            ].map(({ icon: Icon, title, description, to, cta }) => (
              <a
                key={title}
                href={to}
                className="group rounded-lg border border-border bg-card p-6 space-y-4 hover:border-primary/50 hover:shadow-gold transition-all cursor-pointer block no-underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ to });
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
                <span className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  {cta} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Ownership Structure */}
      <section className="border-t border-border bg-card py-20">
        <div className="container">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-display text-4xl font-bold">
              {t("home.ownership.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("home.ownership.subtitle")}
            </p>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                label: "RTS Enterprises (Robin T. Harding Smith)",
                pct: 70,
                color: "bg-primary",
              },
              {
                label: "Mildred Harding Estate & Small Business Trust (ESBT)",
                pct: 20,
                color: "bg-primary/60",
              },
              {
                label: "508(c)(1)(A) Faith-Based Organization",
                pct: 10,
                color: "bg-primary/30",
              },
            ].map(({ label, pct, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{label}</span>
                  <span className="text-primary font-bold">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2 text-center">
              {t("home.ownership.note")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center space-y-6">
          <h2 className="font-display text-4xl font-bold">
            {t("home.cta.title")}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              onClick={() => navigate({ to: "/artist-portal" })}
            >
              {t("home.cta.getStarted")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:border-primary/50"
              onClick={() => navigate({ to: "/event-registration" })}
            >
              {t("home.cta.viewEvents")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
