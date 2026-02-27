import { useState } from 'react';
import { useSubmitMusicalPiece } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Music } from 'lucide-react';
import { toast } from 'sonner';

interface SubmitPieceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function SubmitPieceDialog({ open, onOpenChange, onSuccess }: SubmitPieceDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const submitPiece = useSubmitMusicalPiece();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a piece title.');
      return;
    }

    try {
      await submitPiece.mutateAsync({ title: title.trim(), description: description.trim() });
      toast.success('Musical piece submitted successfully!');
      setTitle('');
      setDescription('');
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit piece. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Submit Musical Piece
          </DialogTitle>
          <DialogDescription>
            Add a new musical piece to your portfolio. You need 15 pieces to become eligible for share purchases.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="piece-title">Piece Title *</Label>
            <Input
              id="piece-title"
              placeholder="e.g., Symphony No. 1 in D Minor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piece-description">Description (Optional)</Label>
            <Textarea
              id="piece-description"
              placeholder="Brief description of the piece..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-muted/50 resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitPiece.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={submitPiece.isPending}
            >
              {submitPiece.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Piece'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
