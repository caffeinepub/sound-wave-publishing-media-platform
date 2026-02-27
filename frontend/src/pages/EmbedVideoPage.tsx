import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetMedia, useRecordEvent } from '../hooks/useQueries';
import { MediaType } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { getPersistedUrlParameter } from '../utils/urlParams';
import { useEffect, useRef } from 'react';

export default function EmbedVideoPage() {
  const { mediaId } = useParams({ from: '/embed/video/$mediaId' });
  const navigate = useNavigate();
  const { data: media, isLoading } = useGetMedia(mediaId);
  const recordEvent = useRecordEvent();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (!hasRecorded.current && mediaId) {
      hasRecorded.current = true;
      const ref = getPersistedUrlParameter('ref');
      recordEvent.mutate({
        eventType: 'embed_video_view',
        ref: ref,
        mediaId: mediaId,
      });
    }
  }, [mediaId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium">Video not found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The requested media could not be found or is not available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (media.mediaType !== MediaType.video) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium">Not a video</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The requested media is not a video file.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const referralSource = getPersistedUrlParameter('ref');
  const fullMediaUrl = referralSource === 'elasticstage' 
    ? `/media/${mediaId}?ref=elasticstage`
    : `/media/${mediaId}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <h1 className="text-xl font-bold">{media.title}</h1>
          </div>
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <video
              src={media.fileReference.getDirectURL()}
              controls
              className="h-full w-full"
              controlsList="nodownload"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fullMediaUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View full page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
