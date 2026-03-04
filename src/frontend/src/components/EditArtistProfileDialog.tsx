import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ArtistProfile } from "../backend";
import { useUpdateArtistProfile } from "../hooks/useQueries";

interface EditArtistProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ArtistProfile;
}

export default function EditArtistProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditArtistProfileDialogProps) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [licensingInfo, setLicensingInfo] = useState("");
  const [elasticStageUrl, setElasticStageUrl] = useState("");
  const [elasticStageId, setElasticStageId] = useState("");
  const updateProfile = useUpdateArtistProfile();

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio);
      setContactInfo(profile.contactInfo);
      setLicensingInfo(profile.licensingInfo);
      setElasticStageUrl(profile.elasticStageArtistUrl || "");
      setElasticStageId(profile.elasticStageArtistId || "");
    }
  }, [profile]);

  const validateElasticStageUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Optional field
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" && parsed.hostname === "elasticstage.com"
      );
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bio.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (elasticStageUrl.trim() && !validateElasticStageUrl(elasticStageUrl)) {
      toast.error(
        "ElasticStage URL must be a valid https://elasticstage.com URL",
      );
      return;
    }

    try {
      await updateProfile.mutateAsync({
        ...profile,
        name: name.trim(),
        bio: bio.trim(),
        contactInfo: contactInfo.trim(),
        licensingInfo: licensingInfo.trim(),
        elasticStageArtistUrl: elasticStageUrl.trim() || undefined,
        elasticStageArtistId: elasticStageId.trim() || undefined,
      });
      toast.success("Artist profile updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update artist profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Artist Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Artist Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Information</Label>
            <Input
              id="contact"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email, website, social media"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensing">Licensing Information</Label>
            <Textarea
              id="licensing"
              value={licensingInfo}
              onChange={(e) => setLicensingInfo(e.target.value)}
              rows={3}
              placeholder="General licensing terms and conditions"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="elasticStageUrl"
              className="flex items-center gap-2"
            >
              ElasticStage Artist URL (optional)
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Label>
            <Input
              id="elasticStageUrl"
              type="url"
              value={elasticStageUrl}
              onChange={(e) => setElasticStageUrl(e.target.value)}
              placeholder="https://elasticstage.com/artist/your-name"
            />
            <p className="text-xs text-muted-foreground">
              External link to your ElasticStage profile (third-party site).
              Must be a valid https://elasticstage.com URL.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="elasticStageId">
              ElasticStage Artist ID (optional)
            </Label>
            <Input
              id="elasticStageId"
              value={elasticStageId}
              onChange={(e) => setElasticStageId(e.target.value)}
              placeholder="your-artist-id"
            />
            <p className="text-xs text-muted-foreground">
              Your artist ID on ElasticStage (external reference only).
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
