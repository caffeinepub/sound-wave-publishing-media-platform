import { useState } from 'react';
import { useUploadMedia } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { ExternalBlob, MediaType, type LicensingOption } from '../backend';
import { Progress } from '@/components/ui/progress';

interface UploadMediaDialogProps {
  artistId: string;
}

export default function UploadMediaDialog({ artistId }: UploadMediaDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.image);
  const [copyrightInfo, setCopyrightInfo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [licensingOptions, setLicensingOptions] = useState<LicensingOption[]>([
    { id: '1', name: 'Personal Use', description: 'For personal, non-commercial use', price: BigInt(1000), terms: 'Personal use only' },
  ]);
  const uploadMedia = useUploadMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addLicensingOption = () => {
    const newId = (licensingOptions.length + 1).toString();
    setLicensingOptions([
      ...licensingOptions,
      { id: newId, name: '', description: '', price: BigInt(0), terms: '' },
    ]);
  };

  const updateLicensingOption = (index: number, field: keyof LicensingOption, value: string | bigint) => {
    const updated = [...licensingOptions];
    updated[index] = { ...updated[index], [field]: value };
    setLicensingOptions(updated);
  };

  const removeLicensingOption = (index: number) => {
    setLicensingOptions(licensingOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(fileBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const mediaId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await uploadMedia.mutateAsync({
        id: mediaId,
        artistId,
        title: title.trim(),
        description: description.trim(),
        mediaType,
        copyrightInfo: copyrightInfo.trim() || `© ${new Date().getFullYear()} All Rights Reserved`,
        licensingOptions: licensingOptions.filter((opt) => opt.name.trim()),
        fileReference: blob,
      });

      toast.success('Media uploaded successfully!');
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload media');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMediaType(MediaType.image);
    setCopyrightInfo('');
    setFile(null);
    setUploadProgress(0);
    setLicensingOptions([
      { id: '1', name: 'Personal Use', description: 'For personal, non-commercial use', price: BigInt(1000), terms: 'Personal use only' },
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
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
            <Select value={mediaType} onValueChange={(value) => setMediaType(value as MediaType)}>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Licensing Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLicensingOption}>
                <Plus className="mr-1 h-3 w-3" />
                Add Option
              </Button>
            </div>
            <div className="space-y-3">
              {licensingOptions.map((option, index) => (
                <div key={option.id} className="space-y-2 rounded-lg border p-3">
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
                    onChange={(e) => updateLicensingOption(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={option.description}
                    onChange={(e) => updateLicensingOption(index, 'description', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Price in cents (e.g., 1000 = $10.00)"
                    value={Number(option.price)}
                    onChange={(e) => updateLicensingOption(index, 'price', BigInt(e.target.value || 0))}
                  />
                  <Input
                    placeholder="Terms"
                    value={option.terms}
                    onChange={(e) => updateLicensingOption(index, 'terms', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={uploadMedia.isPending}>
            {uploadMedia.isPending ? 'Uploading...' : 'Upload Media'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
