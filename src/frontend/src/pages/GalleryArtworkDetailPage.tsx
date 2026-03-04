import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Download,
  ExternalLink,
  Feather,
  Film,
  Frame,
  Music,
  Music2,
  Palette,
  Scissors,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetLicensingOptions, useGetMedia } from "../hooks/useQueries";

const CATEGORY_LABELS: Record<string, string> = {
  narrativeArts: "Narrative Arts",
  poetry: "Poetry",
  photography: "Photography",
  artDesigns: "Art Designs",
  artsAndCrafts: "Arts & Crafts",
  cinemaCreation: "Cinema Creation",
  musicalWorks: "Musical Works",
  scoreSheets: "Score Sheets",
};

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  narrativeArts: BookOpen,
  poetry: Feather,
  photography: Camera,
  artDesigns: Palette,
  artsAndCrafts: Scissors,
  cinemaCreation: Film,
  musicalWorks: Music,
  scoreSheets: Music2,
};

const FORMAT_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  print: Frame,
  original: ExternalLink,
  digitalDownload: Download,
};

const FORMAT_LABELS: Record<string, string> = {
  print: "Print",
  original: "Original",
  digitalDownload: "Digital Download",
};

export default function GalleryArtworkDetailPage() {
  const { category, mediaId } = useParams({
    from: "/galleries/$category/$mediaId",
  });
  const navigate = useNavigate();
  const { data: media, isLoading } = useGetMedia(mediaId);
  const { data: licensingOptions = [] } = useGetLicensingOptions(mediaId);

  const CategoryIcon =
    (media?.artworkCategory
      ? CATEGORY_ICONS[media.artworkCategory]
      : undefined) ?? Music;

  if (isLoading) {
    return (
      <div className="container py-8" data-ocid="artwork_detail.page">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div
        className="container py-16 text-center"
        data-ocid="artwork_detail.page"
      >
        <p className="text-muted-foreground">Artwork not found.</p>
        <Button
          className="mt-4"
          onClick={() =>
            navigate({ to: "/galleries/$category", params: { category } })
          }
        >
          Back to Gallery
        </Button>
      </div>
    );
  }

  const categoryLabel = media.artworkCategory
    ? (CATEGORY_LABELS[media.artworkCategory] ?? media.artworkCategory)
    : null;

  const hasCopyright = !!media.copyrightInfo;

  return (
    <div className="min-h-screen" data-ocid="artwork_detail.page">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => navigate({ to: "/galleries" })}
            className="hover:text-foreground transition-colors"
          >
            Galleries
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/galleries/$category", params: { category } })
            }
            className="hover:text-foreground transition-colors"
          >
            {CATEGORY_LABELS[category] ?? category}
          </button>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{media.title}</span>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2"
          onClick={() =>
            navigate({ to: "/galleries/$category", params: { category } })
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {CATEGORY_LABELS[category] ?? "Gallery"}
        </Button>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Media Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
              {media.mediaType === "image" ? (
                <img
                  src={media.fileReference.getDirectURL()}
                  alt={media.title}
                  className="w-full h-full object-contain"
                />
              ) : media.mediaType === "video" ? (
                // biome-ignore lint/a11y/useMediaCaption: video art — no caption required
                <video
                  src={media.fileReference.getDirectURL()}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : media.mediaType === "music" ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                  <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Music className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {media.title}
                  </p>
                  {/* biome-ignore lint/a11y/useMediaCaption: music player — no caption required */}
                  <audio
                    src={media.fileReference.getDirectURL()}
                    controls
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <CategoryIcon className="h-20 w-20 text-primary/40" />
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        media.fileReference.getDirectURL(),
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    View / Download
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title + Artist */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                {categoryLabel && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex-shrink-0"
                  >
                    {categoryLabel}
                  </Badge>
                )}
                {hasCopyright && (
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground mt-0.5 flex-shrink-0 gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    Copyrighted
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                {media.title}
              </h1>
              <button
                type="button"
                data-ocid="artwork_detail.artist_link"
                onClick={() =>
                  navigate({
                    to: "/artist/$artistId",
                    params: { artistId: media.artistId },
                  })
                }
                className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <span>by {media.artistId.slice(0, 16)}...</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Description */}
            {media.description && (
              <p className="text-muted-foreground leading-relaxed text-sm">
                {media.description}
              </p>
            )}

            {/* Copyright Info */}
            {media.copyrightInfo && (
              <Card className="border-border bg-card/50">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Copyright Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-muted-foreground">
                    {media.copyrightInfo}
                  </p>
                </CardContent>
              </Card>
            )}

            <Separator className="border-border" />

            {/* Sale Formats */}
            {media.saleFormats && media.saleFormats.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold mb-3">
                  Purchase Options
                </h2>
                <div className="grid gap-3 sm:grid-cols-1">
                  {media.saleFormats.map((fmt, index) => {
                    const FmtIcon = FORMAT_ICONS[fmt.formatType] ?? Download;
                    const fmtLabel =
                      FORMAT_LABELS[fmt.formatType] ?? fmt.formatType;
                    const ocid =
                      index < 3
                        ? `artwork_detail.purchase_button.${index + 1}`
                        : undefined;
                    return (
                      <div
                        key={`fmt-${fmt.formatType}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <FmtIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{fmtLabel}</p>
                            {fmt.description && (
                              <p className="text-xs text-muted-foreground">
                                {fmt.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">
                            ${(Number(fmt.price) / 100).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            data-ocid={ocid}
                            onClick={() =>
                              navigate({ to: "/event-registration" })
                            }
                          >
                            Purchase
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Licensing Options */}
            {licensingOptions.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold mb-3">
                  Licensing Options
                </h2>
                <div className="grid gap-3">
                  {licensingOptions.map((opt, index) => {
                    const ocid =
                      index < 3
                        ? `artwork_detail.license_button.${index + 1}`
                        : undefined;
                    return (
                      <div
                        key={opt.id}
                        className="rounded-lg border border-border bg-card/50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{opt.name}</p>
                            {opt.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {opt.description}
                              </p>
                            )}
                            {opt.terms && (
                              <p className="text-xs text-muted-foreground/70 mt-1 italic">
                                {opt.terms}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="font-bold text-primary text-sm">
                              ${(Number(opt.price) / 100).toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary/40 text-primary hover:bg-primary/10"
                              data-ocid={ocid}
                              onClick={() =>
                                navigate({ to: "/event-registration" })
                              }
                            >
                              License
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No purchase options message */}
            {(!media.saleFormats || media.saleFormats.length === 0) &&
              licensingOptions.length === 0 && (
                <Card className="border-border bg-card/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Contact the artist for pricing and licensing information.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() =>
                        navigate({
                          to: "/artist/$artistId",
                          params: { artistId: media.artistId },
                        })
                      }
                    >
                      View Artist Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
