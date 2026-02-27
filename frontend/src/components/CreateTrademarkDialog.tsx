import { useState } from 'react';
import { useCreateTrademarkRecord, useUpdateTrademarkRecord } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, FileText } from 'lucide-react';
import { ExternalBlob, type TrademarkRecord } from '../backend';
import { Progress } from '@/components/ui/progress';

interface CreateTrademarkDialogProps {
  artistId: string;
  existingTrademark?: TrademarkRecord;
  trigger?: React.ReactNode;
}

export default function CreateTrademarkDialog({ artistId, existingTrademark, trigger }: CreateTrademarkDialogProps) {
  const [open, setOpen] = useState(false);
  const [markName, setMarkName] = useState(existingTrademark?.markName || '');
  const [registrationNumber, setRegistrationNumber] = useState(existingTrademark?.registrationNumber || '');
  const [status, setStatus] = useState(existingTrademark?.status || 'Pending');
  const [description, setDescription] = useState(existingTrademark?.description || '');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filingDate, setFilingDate] = useState(
    existingTrademark ? new Date(Number(existingTrademark.filingDate) / 1000000).toISOString().split('T')[0] : ''
  );

  const createTrademark = useCreateTrademarkRecord();
  const updateTrademark = useUpdateTrademarkRecord();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF or image file (JPEG, PNG)');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markName.trim() || !registrationNumber.trim() || !filingDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let documentReference = existingTrademark?.documentReference;

      if (file) {
        const fileBytes = new Uint8Array(await file.arrayBuffer());
        documentReference = ExternalBlob.fromBytes(fileBytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const trademarkId = existingTrademark?.id || `tm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const filingTimestamp = BigInt(new Date(filingDate).getTime() * 1000000);

      const record: TrademarkRecord = {
        id: trademarkId,
        artistId,
        markName: markName.trim(),
        registrationNumber: registrationNumber.trim(),
        status,
        description: description.trim(),
        documentReference: documentReference || undefined,
        filingDate: filingTimestamp,
      };

      if (existingTrademark) {
        await updateTrademark.mutateAsync(record);
        toast.success('Trademark updated successfully!');
      } else {
        await createTrademark.mutateAsync(record);
        toast.success('Trademark created successfully!');
      }

      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${existingTrademark ? 'update' : 'create'} trademark`);
    }
  };

  const resetForm = () => {
    if (!existingTrademark) {
      setMarkName('');
      setRegistrationNumber('');
      setStatus('Pending');
      setDescription('');
      setFilingDate('');
    }
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Trademark
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{existingTrademark ? 'Edit Trademark' : 'Add New Trademark'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="markName">Trademark Name *</Label>
            <Input
              id="markName"
              value={markName}
              onChange={(e) => setMarkName(e.target.value)}
              placeholder="Enter trademark name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Enter registration number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filingDate">Filing Date *</Label>
            <Input
              id="filingDate"
              type="date"
              value={filingDate}
              onChange={(e) => setFilingDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter trademark description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Supporting Document (PDF or Image)</Label>
            <div className="flex items-center gap-2">
              <Input id="document" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
              {existingTrademark?.documentReference && !file && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(existingTrademark.documentReference!.getDirectURL(), '_blank')}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              )}
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} className="mt-2" />}
            <p className="text-xs text-muted-foreground">Upload trademark registration documents or certificates</p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createTrademark.isPending || updateTrademark.isPending}
          >
            {createTrademark.isPending || updateTrademark.isPending
              ? existingTrademark
                ? 'Updating...'
                : 'Creating...'
              : existingTrademark
                ? 'Update Trademark'
                : 'Create Trademark'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
