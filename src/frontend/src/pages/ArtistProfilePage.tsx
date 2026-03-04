import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, FileText, Mail, User } from "lucide-react";
import { useState } from "react";
import type { ArtworkCategory } from "../backend";
import MediaCard from "../components/MediaCard";
import {
  useGetArtistProfile,
  useGetArtistWorks,
  useGetArtistWorksByCategory,
} from "../hooks/useQueries";

const CATEGORY_TABS: Array<{
  value: string;
  label: string;
  category?: ArtworkCategory;
}> = [
  { value: "all", label: "All Works" },
  {
    value: "narrativeArts",
    label: "Narrative Arts",
    category: "narrativeArts" as ArtworkCategory,
  },
  { value: "poetry", label: "Poetry", category: "poetry" as ArtworkCategory },
  {
    value: "photography",
    label: "Photography",
    category: "photography" as ArtworkCategory,
  },
  {
    value: "artDesigns",
    label: "Art Designs",
    category: "artDesigns" as ArtworkCategory,
  },
  {
    value: "artsAndCrafts",
    label: "Arts & Crafts",
    category: "artsAndCrafts" as ArtworkCategory,
  },
  {
    value: "cinemaCreation",
    label: "Cinema",
    category: "cinemaCreation" as ArtworkCategory,
  },
  {
    value: "musicalWorks",
    label: "Musical Works",
    category: "musicalWorks" as ArtworkCategory,
  },
  {
    value: "scoreSheets",
    label: "Score Sheets",
    category: "scoreSheets" as ArtworkCategory,
  },
];

function CategoryWorksGrid({
  artistId,
  category,
}: {
  artistId: string;
  category: ArtworkCategory;
}) {
  const { data: works = [], isLoading } = useGetArtistWorksByCategory(
    artistId,
    category,
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {["a", "b", "c"].map((k) => (
          <Card key={`skel-${k}`} className="overflow-hidden">
            <div className="aspect-video animate-pulse bg-muted" />
            <CardContent className="p-4">
              <div className="h-4 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No works in this category yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {works.slice(0, 3).map((media, index) => (
        <div
          key={media.id}
          data-ocid={`artist_profile.artwork.item.${index + 1}`}
        >
          <MediaCard media={media} />
        </div>
      ))}
      {works.slice(3).map((media) => (
        <MediaCard key={media.id} media={media} />
      ))}
    </div>
  );
}

export default function ArtistProfilePage() {
  const { artistId } = useParams({ from: "/artist/$artistId" });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const { data: artist, isLoading: artistLoading } =
    useGetArtistProfile(artistId);
  const { data: works = [], isLoading: worksLoading } =
    useGetArtistWorks(artistId);

  if (artistLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-32 rounded-lg bg-muted" />
          <div className="h-6 w-3/4 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">Artist not found</p>
              <Button className="mt-4" onClick={() => navigate({ to: "/" })}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/" })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gallery
      </Button>

      {/* Artist Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{artist.name}</h1>
              <p className="mt-3 text-muted-foreground">{artist.bio}</p>
              {artist.contactInfo && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {artist.contactInfo}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ElasticStage External Link */}
      {artist.elasticStageArtistUrl && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Also on ElasticStage</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  External link to third-party site
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    artist.elasticStageArtistUrl!,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on ElasticStage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Licensing Info */}
      {artist.licensingInfo && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Licensing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {artist.licensingInfo}
            </p>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      {/* Artist Works with Category Tabs */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Works by {artist.name}</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="flex flex-wrap h-auto gap-1 mb-6 bg-muted/50 p-1 rounded-lg"
            data-ocid="artist_profile.works_tab"
          >
            {CATEGORY_TABS.map((tab, index) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs px-3 py-1.5"
                data-ocid={`artist_profile.category_tab.${index + 1}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            {worksLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {["a", "b", "c", "d"].map((k) => (
                  <Card key={`skeleton-${k}`} className="overflow-hidden">
                    <div className="aspect-video animate-pulse bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : works.length === 0 ? (
              <Card>
                <CardContent className="flex min-h-[300px] items-center justify-center">
                  <p className="text-muted-foreground">
                    No works available yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {works.slice(0, 3).map((media, index) => (
                  <div
                    key={media.id}
                    data-ocid={`artist_profile.artwork.item.${index + 1}`}
                  >
                    <MediaCard media={media} />
                  </div>
                ))}
                {works.slice(3).map((media) => (
                  <MediaCard key={media.id} media={media} />
                ))}
              </div>
            )}
          </TabsContent>

          {CATEGORY_TABS.filter((t) => t.category).map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {activeTab === tab.value && (
                <CategoryWorksGrid
                  artistId={artistId}
                  category={tab.category!}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
