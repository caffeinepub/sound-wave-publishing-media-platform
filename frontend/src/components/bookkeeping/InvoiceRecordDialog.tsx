import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useGetAllArtistProfiles, useGetAllMedia, useCreateInvoiceRecord, useUpdateInvoiceRecord } from '../../hooks/useQueries';
import type { InvoiceRecord } from '../../backend';

interface InvoiceRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord?: InvoiceRecord | null;
}

export default function InvoiceRecordDialog({ open, onOpenChange, editingRecord }: InvoiceRecordDialogProps) {
  const { data: artists = [] } = useGetAllArtistProfiles();
  const { data: media = [] } = useGetAllMedia();
  const createRecord = useCreateInvoiceRecord();
  const updateRecord = useUpdateInvoiceRecord();

  const [artistId, setArtistId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [mediaId, setMediaId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingRecord) {
      setArtistId(editingRecord.artistId);
      setAmount((Number(editingRecord.amount) / 100).toFixed(2));
      setDescription(editingRecord.description);
      setMediaId(editingRecord.mediaId || '');
      setNotes(editingRecord.notes || '');
    } else {
      setArtistId('');
      setAmount('');
      setDescription('');
      setMediaId('');
      setNotes('');
    }
  }, [editingRecord, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!artistId) {
      toast.error('Please select an artist/member');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      if (editingRecord) {
        await updateRecord.mutateAsync({
          ...editingRecord,
          artistId,
          amount: BigInt(amountInCents),
          description: description.trim(),
          mediaId: mediaId || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success('Invoice record updated successfully');
      } else {
        await createRecord.mutateAsync({
          artistId,
          amount: BigInt(amountInCents),
          description: description.trim(),
          mediaId: mediaId || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success('Invoice record created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save invoice record');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingRecord ? 'Edit Invoice Record' : 'Add Invoice Record'}</DialogTitle>
          <DialogDescription>Record an invoice for artist services or media.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="artist">Artist/Member *</Label>
              <Select value={artistId} onValueChange={setArtistId}>
                <SelectTrigger id="artist">
                  <SelectValue placeholder="Select artist/member" />
                </SelectTrigger>
                <SelectContent>
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.id}>
                      {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the invoice"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="media">Associated Media (Optional)</Label>
              <Select value={mediaId} onValueChange={setMediaId}>
                <SelectTrigger id="media">
                  <SelectValue placeholder="Select media (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {media.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes about this invoice"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRecord.isPending || updateRecord.isPending}>
              {createRecord.isPending || updateRecord.isPending ? 'Saving...' : editingRecord ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
