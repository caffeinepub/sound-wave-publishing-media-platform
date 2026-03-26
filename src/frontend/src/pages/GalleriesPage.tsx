import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Camera,
  ChevronRight,
  Feather,
  Film,
  Music,
  Music2,
  Palette,
  Scissors,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "../lib/i18n";

const ART_CATEGORY_DEFS = [
  {
    key: "narrativeArts",
    catKey: "cat.narrativeArts",
    description: "Stories, novellas, and written narratives",
    image: "/assets/generated/category-narrative-arts.dim_400x400.jpg",
    Icon: BookOpen,
  },
  {
    key: "poetry",
    catKey: "cat.poetry",
    description: "Poems, verse, and spoken word",
    image: "/assets/generated/category-poetry.dim_400x400.jpg",
    Icon: Feather,
  },
  {
    key: "photography",
    catKey: "cat.photography",
    description: "Photographic art and visual storytelling",
    image: "/assets/generated/category-photography.dim_400x400.jpg",
    Icon: Camera,
  },
  {
    key: "artDesigns",
    catKey: "cat.artDesigns",
    description: "Digital art, graphic design, and illustrations",
    image: "/assets/generated/category-art-designs.dim_400x400.jpg",
    Icon: Palette,
  },
  {
    key: "artsAndCrafts",
    catKey: "cat.artsAndCrafts",
    description: "Handcrafted works and mixed media",
    image: "/assets/generated/category-arts-crafts.dim_400x400.jpg",
    Icon: Scissors,
  },
  {
    key: "cinemaCreation",
    catKey: "cat.cinemaCreation",
    description: "Films, short films, and video art",
    image: "/assets/generated/category-cinema.dim_400x400.jpg",
    Icon: Film,
  },
  {
    key: "musicalWorks",
    catKey: "cat.musicalWorks",
    description: "Musical compositions and recordings",
    image: "/assets/generated/category-musical-works.dim_400x400.jpg",
    Icon: Music,
  },
  {
    key: "scoreSheets",
    catKey: "cat.scoreSheets",
    description: "Sheet music and musical scores",
    image: "/assets/generated/category-score-sheets.dim_400x400.jpg",
    Icon: Music2,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function GalleriesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ART_CATEGORIES = ART_CATEGORY_DEFS.map((c) => ({
    ...c,
    label: t(c.catKey),
  }));

  return (
    <div className="min-h-screen" data-ocid="galleries.page">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        data-ocid="galleries.hero.section"
      >
        {/* Deep layered background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.25_0.06_75/0.35),transparent)]" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bg.dim_1440x600.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

        <div className="relative container py-28 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Decorative rule */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary">
                Sound Waves Publishing &amp; Media
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground mb-6">
              {t("galleries.title", "The Creative Galleries")}
            </h1>

            <p className="font-serif-body text-xl italic text-primary/90 mb-4">
              {t("galleries.tagline")}
            </p>

            <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              {t("galleries.subtitle")}
            </p>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="h-px w-12 bg-primary/30" />
              <div className="h-1 w-1 rounded-full bg-primary/50" />
              <div className="h-px w-24 bg-primary/50" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <div className="h-px w-24 bg-primary/50" />
              <div className="h-1 w-1 rounded-full bg-primary/50" />
              <div className="h-px w-12 bg-primary/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {ART_CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.key}
                variants={cardVariants}
                data-ocid={`galleries.category.card.${index + 1}`}
              >
                <button
                  type="button"
                  data-ocid={`galleries.category.link.${index + 1}`}
                  onClick={() =>
                    navigate({
                      to: "/galleries/$category",
                      params: { category: cat.key },
                    })
                  }
                  className="group w-full text-left relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-gold transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    {/* Fallback */}
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10">
                      <cat.Icon className="h-16 w-16 text-primary/60" />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    {/* Gold shimmer on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <cat.Icon className="h-4 w-4 text-primary flex-shrink-0" />
                          <h3 className="font-display font-bold text-lg text-foreground leading-tight truncate">
                            {cat.label}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-200">
                      <span>{t("galleries.explore")}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center space-y-4"
          >
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {t("galleries.artistCta")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                onClick={() => navigate({ to: "/artist-portal" })}
              >
                {t("galleries.joinArtist")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:border-primary/50"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                {t("galleries.uploadWork")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
