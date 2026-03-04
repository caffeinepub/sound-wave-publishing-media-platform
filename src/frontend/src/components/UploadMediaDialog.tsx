import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArtworkCategory,
  ExternalBlob,
  type LicensingOption,
  MediaType,
  type SaleFormat,
} from "../backend";
import { useUploadMedia } from "../hooks/useQueries";

interface UploadMediaDialogProps {
  artistId: string;
}

export default function UploadMediaDialog({
  artistId,
}: UploadMediaDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.image);
  const [artworkCategory, setArtworkCategory] = useState<
    ArtworkCategory | "none"
  >("none");
  const [copyrightInfo, setCopyrightInfo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [licensingOptions, setLicensingOptions] = useState<LicensingOption[]>([
    {
      id: "1",
      name: "Personal Use",
      description: "For personal, non-commercial use",
      price: BigInt(1000),
      terms: "Personal use only",
    },
  ]);
  const [saleFormats, setSaleFormats] = useState<SaleFormat[]>([]);
  const uploadMedia = useUploadMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addLicensingOption = () => {
    const newId = (licensingOptions.length + 1).toString();
    setLicensingOptions([
      ...licensingOptions,
      { id: newId, name: "", description: "", price: BigInt(0), terms: "" },
    ]);
  };

  const updateLicensingOption = (
    index: number,
    field: keyof LicensingOption,
    value: string | bigint,
  ) => {
    const updated = [...licensingOptions];
    updated[index] = { ...updated[index], [field]: value };
    setLicensingOptions(updated);
  };

  const removeLicensingOption = (index: number) => {
    setLicensingOptions(licensingOptions.filter((_, i) => i !== index));
  };

  const addSaleFormat = () => {
    if (saleFormats.length >= 3) return;
    const defaults: Array<SaleFormat["formatType"]> = [
      "print",
      "original",
      "digitalDownload",
    ];
    const usedTypes = saleFormats.map((f) => f.formatType);
    const nextType = defaults.find((t) => !usedTypes.includes(t)) ?? "print";
    setSaleFormats([
      ...saleFormats,
      { formatType: nextType, description: "", price: BigInt(0) },
    ]);
  };

  const updateSaleFormat = (
    index: number,
    field: keyof SaleFormat,
    value: string | bigint,
  ) => {
    const updated = [...saleFormats];
    updated[index] = { ...updated[index], [field]: value };
    setSaleFormats(updated);
  };

  const removeSaleFormat = (index: number) => {
    setSaleFormats(saleFormats.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields and select a file");
      return;
    }

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(fileBytes).withUploadProgress(
        (percentage) => {
          setUploadProgress(percentage);
        },
      );

      const mediaId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await uploadMedia.mutateAsync({
        id: mediaId,
        artistId,
        title: title.trim(),
        description: description.trim(),
        mediaType,
        artworkCategory:
          artworkCategory !== "none"
            ? (artworkCategory as ArtworkCategory)
            : undefined,
        copyrightInfo:
          copyrightInfo.trim() ||
          `© ${new Date().getFullYear()} All Rights Reserved`,
        licensingOptions: licensingOptions.filter((opt) => opt.name.trim()),
        saleFormats: saleFormats.filter((f) => f.formatType),
        fileReference: blob,
      });

      toast.success("Media uploaded successfully!");
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload media");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMediaType(MediaType.image);
    setArtworkCategory("none");
    setCopyrightInfo("");
    setFile(null);
    setUploadProgress(0);
    setSaleFormats([]);
    setLicensingOptions([
      {
        id: "1",
        name: "Personal Use",
        description: "For personal, non-commercial use",
        price: BigInt(1000),
        terms: "Personal use only",
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload New Media</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaType">Media Type *</Label>
            <Select
              value={mediaType}
              onValueChange={(value) => setMediaType(value as MediaType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MediaType.image}>Image</SelectItem>
                <SelectItem value={MediaType.music}>Music</SelectItem>
                <SelectItem value={MediaType.video}>Video</SelectItem>
                <SelectItem value={MediaType.text}>Text/Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="artworkCategory">Art Category</Label>
            <Select
              value={artworkCategory}
              onValueChange={(value) =>
                setArtworkCategory(value as ArtworkCategory | "none")
              }
            >
              <SelectTrigger data-ocid="dashboard.artwork_category.select">
                <SelectValue placeholder="None / Unspecified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None / Unspecified</SelectItem>
                <SelectItem value={ArtworkCategory.narrativeArts}>
                  Narrative Arts
                </SelectItem>
                <SelectItem value={ArtworkCategory.poetry}>Poetry</SelectItem>
                <SelectItem value={ArtworkCategory.photography}>
                  Photography
                </SelectItem>
                <SelectItem value={ArtworkCategory.artDesigns}>
                  Art Designs
                </SelectItem>
                <SelectItem value={ArtworkCategory.artsAndCrafts}>
                  Arts &amp; Crafts
                </SelectItem>
                <SelectItem value={ArtworkCategory.cinemaCreation}>
                  Cinema Creation
                </SelectItem>
                <SelectItem value={ArtworkCategory.musicalWorks}>
                  Musical Works
                </SelectItem>
                <SelectItem value={ArtworkCategory.scoreSheets}>
                  Score Sheets
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Information</Label>
            <Input
              id="copyright"
              value={copyrightInfo}
              onChange={(e) => setCopyrightInfo(e.target.value)}
              placeholder={`© ${new Date().getFullYear()} All Rights Reserved`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input id="file" type="file" onChange={handleFileChange} required />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Progress value={uploadProgress} className="mt-2" />
            )}
          </div>

          {/* Sale Formats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sale Formats</Label>
              {saleFormats.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSaleFormat}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Format
                </Button>
              )}
            </div>
            {saleFormats.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add up to 3 sale formats (Print, Original, Digital Download).
              </p>
            )}
            <div className="space-y-3">
              {saleFormats.map((fmt, index) => (
                <div
                  key={`fmt-${fmt.formatType}-${index}`}
                  className="space-y-2 rounded-lg border p-3"
                  data-ocid={`dashboard.sale_format.${index + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Format {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSaleFormat(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Select
                    value={fmt.formatType}
                    onValueChange={(v) =>
                      updateSaleFormat(index, "formatType", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="print">Print</SelectItem>
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="digitalDownload">
                        Digital Download
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Description"
                    value={fmt.description}
                    onChange={(e) =>
                      updateSaleFormat(index, "description", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Price in cents (e.g., 2500 = $25.00)"
                    value={Number(fmt.price)}
                    data-ocid={`dashboard.sale_format_price.input.${index + 1}`}
                    onChange={(e) =>
                      updateSaleFormat(
                        index,
                        "price",
                        BigInt(e.target.value || 0),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Licensing Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLicensingOption}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Option
              </Button>
            </div>
            <div className="space-y-3">
              {licensingOptions.map((option, index) => (
                <div
                  key={option.id}
                  className="space-y-2 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Option {index + 1}</Label>
                    {licensingOptions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLicensingOption(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="License name"
                    value={option.name}
                    onChange={(e) =>
                      updateLicensingOption(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Description"
                    value={option.description}
                    onChange={(e) =>
                      updateLicensingOption(
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Price in cents (e.g., 1000 = $10.00)"
                    value={Number(option.price)}
                    onChange={(e) =>
                      updateLicensingOption(
                        index,
                        "price",
                        BigInt(e.target.value || 0),
                      )
                    }
                  />
                  <Input
                    placeholder="Terms"
                    value={option.terms}
                    onChange={(e) =>
                      updateLicensingOption(index, "terms", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploadMedia.isPending}
          >
            {uploadMedia.isPending ? "Uploading..." : "Upload Media"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
