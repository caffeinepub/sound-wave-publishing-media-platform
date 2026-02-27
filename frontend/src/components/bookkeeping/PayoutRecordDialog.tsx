import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useGetAllArtistProfiles, useGetAllMedia, useCreatePayoutRecord, useUpdatePayoutRecord } from '../../hooks/useQueries';
import type { PayoutRecord } from '../../backend';

interface PayoutRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord?: PayoutRecord | null;
}

export default function PayoutRecordDialog({ open, onOpenChange, editingRecord }: PayoutRecordDialogProps) {
  const { data: artists = [] } = useGetAllArtistProfiles();
  const { data: media = [] } = useGetAllMedia();
  const createRecord = useCreatePayoutRecord();
  const updateRecord = useUpdatePayoutRecord();

  const [artistId, setArtistId] = useState('');
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [associatedMediaId, setAssociatedMediaId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingRecord) {
      setArtistId(editingRecord.artistId);
      setAmount((Number(editingRecord.amount) / 100).toFixed(2));
      setPayoutMethod(editingRecord.payoutMethod);
      setDestinationAccount(editingRecord.destinationAccount);
      setAssociatedMediaId(editingRecord.associatedMediaId || '');
      setNotes(editingRecord.notes || '');
    } else {
      setArtistId('');
      setAmount('');
      setPayoutMethod('');
      setDestinationAccount('');
      setAssociatedMediaId('');
      setNotes('');
    }
  }, [editingRecord, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!artistId) {
      toast.error('Please select an artist/member');
      return;
    }

    if (!payoutMethod.trim()) {
      toast.error('Please enter a payout method');
      return;
    }

    if (!destinationAccount.trim()) {
      toast.error('Please enter a destination account');
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
          payoutMethod: payoutMethod.trim(),
          destinationAccount: destinationAccount.trim(),
          associatedMediaId: associatedMediaId || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success('Payout record updated successfully');
      } else {
        await createRecord.mutateAsync({
          artistId,
          amount: BigInt(amountInCents),
          destinationAccount: destinationAccount.trim(),
          payoutMethod: payoutMethod.trim(),
          associatedMediaId: associatedMediaId || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success('Payout record created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save payout record');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingRecord ? 'Edit Payout Record' : 'Add Payout Record'}</DialogTitle>
          <DialogDescription>Record an artist payout or financial transaction.</DialogDescription>
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
              <Label htmlFor="payoutMethod">Payout Method *</Label>
              <Input
                id="payoutMethod"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                placeholder="e.g., Bank Transfer, PayPal, Check"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationAccount">Destination Account *</Label>
              <Input
                id="destinationAccount"
                value={destinationAccount}
                onChange={(e) => setDestinationAccount(e.target.value)}
                placeholder="Account number or identifier"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="media">Associated Media (Optional)</Label>
              <Select value={associatedMediaId} onValueChange={setAssociatedMediaId}>
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
                placeholder="Optional notes about this payout"
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
