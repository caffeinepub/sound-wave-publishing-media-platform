import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Feather,
  Film,
  Music,
  Music2,
  Palette,
  Scissors,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { ArtworkCategory, MediaMetadata } from "../backend";
import { useGetMediaByCategory } from "../hooks/useQueries";

const CATEGORY_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
    image: string;
    Icon: React.ComponentType<{ className?: string }>;
    enumKey: ArtworkCategory;
  }
> = {
  narrativeArts: {
    label: "Narrative Arts",
    description: "Stories, novellas, and written narratives",
    image: "/assets/generated/category-narrative-arts.dim_400x400.jpg",
    Icon: BookOpen,
    enumKey: "narrativeArts" as ArtworkCategory,
  },
  poetry: {
    label: "Poetry",
    description: "Poems, verse, and spoken word",
    image: "/assets/generated/category-poetry.dim_400x400.jpg",
    Icon: Feather,
    enumKey: "poetry" as ArtworkCategory,
  },
  photography: {
    label: "Photography",
    description: "Photographic art and visual storytelling",
    image: "/assets/generated/category-photography.dim_400x400.jpg",
    Icon: Camera,
    enumKey: "photography" as ArtworkCategory,
  },
  artDesigns: {
    label: "Art Designs",
    description: "Digital art, graphic design, and illustrations",
    image: "/assets/generated/category-art-designs.dim_400x400.jpg",
    Icon: Palette,
    enumKey: "artDesigns" as ArtworkCategory,
  },
  artsAndCrafts: {
    label: "Arts & Crafts",
    description: "Handcrafted works and mixed media",
    image: "/assets/generated/category-arts-crafts.dim_400x400.jpg",
    Icon: Scissors,
    enumKey: "artsAndCrafts" as ArtworkCategory,
  },
  cinemaCreation: {
    label: "Cinema Creation",
    description: "Films, short films, and video art",
    image: "/assets/generated/category-cinema.dim_400x400.jpg",
    Icon: Film,
    enumKey: "cinemaCreation" as ArtworkCategory,
  },
  musicalWorks: {
    label: "Musical Works",
    description: "Musical compositions and recordings",
    image: "/assets/generated/category-musical-works.dim_400x400.jpg",
    Icon: Music,
    enumKey: "musicalWorks" as ArtworkCategory,
  },
  scoreSheets: {
    label: "Score Sheets",
    description: "Sheet music and musical scores",
    image: "/assets/generated/category-score-sheets.dim_400x400.jpg",
    Icon: Music2,
    enumKey: "scoreSheets" as ArtworkCategory,
  },
};

function getMinPrice(media: MediaMetadata): number | null {
  const prices: number[] = [];
  if (media.licensingOptions.length > 0) {
    prices.push(...media.licensingOptions.map((l) => Number(l.price)));
  }
  if (media.saleFormats && media.saleFormats.length > 0) {
    prices.push(...media.saleFormats.map((f) => Number(f.price)));
  }
  return prices.length > 0 ? Math.min(...prices) : null;
}

export default function GalleryCategoryPage() {
  const { category } = useParams({ from: "/galleries/$category" });
  const navigate = useNavigate();
  const [artistFilter, setArtistFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const config = CATEGORY_CONFIG[category];
  const { data: media = [], isLoading } = useGetMediaByCategory(
    config?.enumKey,
  );

  // Unique artists for filter
  const artists = useMemo(() => {
    const ids = new Set(media.map((m) => m.artistId));
    return Array.from(ids);
  }, [media]);

  // Filtered + sorted
  const displayMedia = useMemo(() => {
    let filtered = media;
    if (artistFilter !== "all") {
      filtered = filtered.filter((m) => m.artistId === artistFilter);
    }
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") {
        return (getMinPrice(a) ?? 0) - (getMinPrice(b) ?? 0);
      }
      if (sortBy === "price-high") {
        return (getMinPrice(b) ?? 0) - (getMinPrice(a) ?? 0);
      }
      // newest — use id as proxy (lexicographic desc)
      return b.id.localeCompare(a.id);
    });
  }, [media, artistFilter, sortBy]);

  if (!config) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Category not found.</p>
        <Button className="mt-4" onClick={() => navigate({ to: "/galleries" })}>
          Back to Galleries
        </Button>
      </div>
    );
  }

  const { label, description, image, Icon } = config;

  return (
    <div className="min-h-screen" data-ocid="gallery_category.page">
      {/* Hero Banner */}
      <section className="relative overflow-hidden h-64 md:h-80">
        <img
          src={image}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative container h-full flex flex-col justify-end pb-8">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit mb-4 text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: "/galleries" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Galleries
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {label}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card/50">
        <div className="container py-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">
            Filter:
          </span>
          <Select value={artistFilter} onValueChange={setArtistFilter}>
            <SelectTrigger
              className="w-[180px] h-8 text-sm"
              data-ocid="gallery_category.filter.select"
            >
              <SelectValue placeholder="All artists" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artists</SelectItem>
              {artists.map((id) => (
                <SelectItem key={id} value={id}>
                  {id.slice(0, 12)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground font-medium ml-2">
            Sort:
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className="w-[150px] h-8 text-sm"
              data-ocid="gallery_category.sort.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>

          {!isLoading && (
            <span className="ml-auto text-xs text-muted-foreground">
              {displayMedia.length} work{displayMedia.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container py-10">
        {isLoading ? (
          <div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            data-ocid="gallery_category.loading_state"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
              <div key={`skel-${i}`} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : displayMedia.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="gallery_category.empty_state"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card mb-6">
              <Icon className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              No works in {label} yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Be the first to share your {label.toLowerCase()} with the world.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Upload Your Work
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {displayMedia.map((item, index) => {
              const minPrice = getMinPrice(item);
              const ocid =
                index < 3
                  ? `gallery_category.artwork.item.${index + 1}`
                  : undefined;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.4) }}
                  data-ocid={ocid}
                >
                  <Card className="group cursor-pointer overflow-hidden border-border hover:border-primary/40 hover:shadow-gold transition-all duration-300">
                    <button
                      type="button"
                      className="relative aspect-square overflow-hidden bg-muted cursor-pointer w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() =>
                        navigate({
                          to: "/galleries/$category/$mediaId",
                          params: { category, mediaId: item.id },
                        })
                      }
                    >
                      {item.mediaType === "image" ? (
                        <img
                          src={item.fileReference.getDirectURL()}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/10">
                          <Icon className="h-12 w-12 text-primary/50" />
                        </div>
                      )}
                      {item.artworkCategory && (
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-background/80 backdrop-blur-sm"
                          >
                            {label}
                          </Badge>
                        </div>
                      )}
                    </button>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {item.artistId.slice(0, 16)}...
                      </p>
                      {minPrice !== null && (
                        <p className="text-xs font-semibold text-primary">
                          From ${(minPrice / 100).toFixed(2)}
                        </p>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 h-7 text-xs hover:border-primary/50 hover:text-primary"
                        onClick={() =>
                          navigate({
                            to: "/galleries/$category/$mediaId",
                            params: { category, mediaId: item.id },
                          })
                        }
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
}
