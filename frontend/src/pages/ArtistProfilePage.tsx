import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetArtistProfile, useGetArtistWorks } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MediaCard from '../components/MediaCard';
import { ArrowLeft, User, Mail, FileText, ExternalLink } from 'lucide-react';

export default function ArtistProfilePage() {
  const { artistId } = useParams({ from: '/artist/$artistId' });
  const navigate = useNavigate();
  const { data: artist, isLoading: artistLoading } = useGetArtistProfile(artistId);
  const { data: works = [], isLoading: worksLoading } = useGetArtistWorks(artistId);

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
              <Button className="mt-4" onClick={() => navigate({ to: '/' })}>
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
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
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
                onClick={() => window.open(artist.elasticStageArtistUrl!, '_blank', 'noopener,noreferrer')}
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
            <p className="text-sm text-muted-foreground">{artist.licensingInfo}</p>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      {/* Artist Works */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Works by {artist.name}</h2>
        {worksLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
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
              <p className="text-muted-foreground">No works available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {works.map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
