import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Image as ImageIcon, Music, Video } from "lucide-react";
import type { MediaMetadata } from "../backend";
import { MediaType } from "../backend";

interface MediaCardProps {
  media: MediaMetadata;
}

export default function MediaCard({ media }: MediaCardProps) {
  const navigate = useNavigate();

  const getMediaIcon = () => {
    switch (media.mediaType) {
      case MediaType.music:
        return <Music className="h-5 w-5" />;
      case MediaType.image:
        return <ImageIcon className="h-5 w-5" />;
      case MediaType.video:
        return <Video className="h-5 w-5" />;
      case MediaType.text:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getMediaTypeLabel = () => {
    return media.mediaType.charAt(0).toUpperCase() + media.mediaType.slice(1);
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={() =>
        navigate({ to: "/media/$mediaId", params: { mediaId: media.id } })
      }
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {media.mediaType === MediaType.image ? (
          <img
            src={media.fileReference.getDirectURL()}
            alt={media.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : media.mediaType === MediaType.video ? (
          <video
            src={media.fileReference.getDirectURL()}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            {getMediaIcon()}
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant="secondary" className="gap-1">
            {getMediaIcon()}
            {getMediaTypeLabel()}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 font-semibold">{media.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {media.description}
        </p>
        {media.licensingOptions.length > 0 && (
          <p className="mt-2 text-sm font-medium text-primary">
            From ${(Number(media.licensingOptions[0].price) / 100).toFixed(2)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
