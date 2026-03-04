import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MembershipFeeRecord } from "../../backend";
import {
  useCreateMembershipFeeRecord,
  useGetAllArtistProfiles,
  useUpdateMembershipFeeRecord,
} from "../../hooks/useQueries";

interface MembershipFeeRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord?: MembershipFeeRecord | null;
}

export default function MembershipFeeRecordDialog({
  open,
  onOpenChange,
  editingRecord,
}: MembershipFeeRecordDialogProps) {
  const { data: artists = [] } = useGetAllArtistProfiles();
  const createRecord = useCreateMembershipFeeRecord();
  const updateRecord = useUpdateMembershipFeeRecord();

  const [artistId, setArtistId] = useState("");
  const [amount, setAmount] = useState("40.00");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editingRecord) {
      setArtistId(editingRecord.artistId);
      setAmount((Number(editingRecord.amount) / 100).toFixed(2));
      setNotes(editingRecord.notes || "");
    } else {
      setArtistId("");
      setAmount("40.00");
      setNotes("");
    }
  }, [editingRecord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!artistId) {
      toast.error("Please select an artist/member");
      return;
    }

    const amountInCents = Math.round(Number.parseFloat(amount) * 100);
    if (Number.isNaN(amountInCents) || amountInCents <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      if (editingRecord) {
        await updateRecord.mutateAsync({
          ...editingRecord,
          artistId,
          amount: BigInt(amountInCents),
          notes: notes.trim() || undefined,
        });
        toast.success("Membership fee record updated successfully");
      } else {
        await createRecord.mutateAsync({
          artistId,
          amount: BigInt(amountInCents),
          notes: notes.trim() || undefined,
        });
        toast.success("Membership fee record created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save membership fee record");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingRecord
              ? "Edit Membership Fee Record"
              : "Add Membership Fee Record"}
          </DialogTitle>
          <DialogDescription>
            Record a $40 membership fee payment to RTS Enterprises Sound Waves
            Publishing and Media.
          </DialogDescription>
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
                placeholder="40.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes about this membership fee"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createRecord.isPending || updateRecord.isPending}
            >
              {createRecord.isPending || updateRecord.isPending
                ? "Saving..."
                : editingRecord
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
