import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useGetAllMembershipFeeRecords,
  useGetAllInvoiceRecords,
  useGetAllPayoutRecords,
  useGetAllArtistProfiles,
  useDeleteMembershipFeeRecord,
  useDeleteInvoiceRecord,
  useDeletePayoutRecord,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import MembershipFeeRecordDialog from '../components/bookkeeping/MembershipFeeRecordDialog';
import InvoiceRecordDialog from '../components/bookkeeping/InvoiceRecordDialog';
import PayoutRecordDialog from '../components/bookkeeping/PayoutRecordDialog';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import type { MembershipFeeRecord, InvoiceRecord, PayoutRecord } from '../backend';

export default function AdminBookkeepingPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  const {
    data: membershipFees = [],
    isLoading: feesLoading,
    error: feesError,
  } = useGetAllMembershipFeeRecords(isAuthenticated && isAdmin === true);
  const {
    data: invoices = [],
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useGetAllInvoiceRecords(isAuthenticated && isAdmin === true);
  const {
    data: payouts = [],
    isLoading: payoutsLoading,
    error: payoutsError,
  } = useGetAllPayoutRecords(isAuthenticated && isAdmin === true);
  const { data: artists = [] } = useGetAllArtistProfiles();

  const deleteMembershipFee = useDeleteMembershipFeeRecord();
  const deleteInvoice = useDeleteInvoiceRecord();
  const deletePayout = useDeletePayoutRecord();

  const [membershipFeeDialogOpen, setMembershipFeeDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);

  const [editingMembershipFee, setEditingMembershipFee] = useState<MembershipFeeRecord | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceRecord | null>(null);
  const [editingPayout, setEditingPayout] = useState<PayoutRecord | null>(null);

  const getArtistName = (artistId: string) => {
    const artist = artists.find((a) => a.id === artistId);
    return artist?.name || artistId;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount: bigint, currency: string) => {
    return `$${(Number(amount) / 100).toFixed(2)} ${currency}`;
  };

  const handleDeleteMembershipFee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership fee record?')) return;
    try {
      await deleteMembershipFee.mutateAsync(id);
      toast.success('Membership fee record deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete membership fee record');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice record?')) return;
    try {
      await deleteInvoice.mutateAsync(id);
      toast.success('Invoice record deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice record');
    }
  };

  const handleDeletePayout = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payout record?')) return;
    try {
      await deletePayout.mutateAsync(id);
      toast.success('Payout record deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete payout record');
    }
  };

  const handleEditMembershipFee = (record: MembershipFeeRecord) => {
    setEditingMembershipFee(record);
    setMembershipFeeDialogOpen(true);
  };

  const handleEditInvoice = (record: InvoiceRecord) => {
    setEditingInvoice(record);
    setInvoiceDialogOpen(true);
  };

  const handleEditPayout = (record: PayoutRecord) => {
    setEditingPayout(record);
    setPayoutDialogOpen(true);
  };

  const handleMembershipFeeDialogClose = () => {
    setMembershipFeeDialogOpen(false);
    setEditingMembershipFee(null);
  };

  const handleInvoiceDialogClose = () => {
    setInvoiceDialogOpen(false);
    setEditingInvoice(null);
  };

  const handlePayoutDialogClose = () => {
    setPayoutDialogOpen(false);
    setEditingPayout(null);
  };

  // Show loading state while checking authentication/authorization
  if (adminLoading) {
    return (
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login required screen if not authenticated
  if (!isAuthenticated) {
    return <AccessDeniedScreen variant="login-required" />;
  }

  // Show unauthorized screen if authenticated but not admin
  if (!isAdmin) {
    return <AccessDeniedScreen variant="unauthorized" />;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookkeeping Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage membership fees, invoices, and payouts for RTS Enterprises Sound Waves Publishing and Media.
        </p>
      </div>

      <Tabs defaultValue="membership-fees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="membership-fees">Membership Fees</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="membership-fees">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Membership Fee Records</CardTitle>
                  <CardDescription>Track $40 membership fees paid to RTS Enterprises.</CardDescription>
                </div>
                <Button onClick={() => setMembershipFeeDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {feesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load membership fee records: {feesError instanceof Error ? feesError.message : 'Unknown error'}. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : feesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : membershipFees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No membership fee records found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Artist/Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membershipFees.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.timestamp)}</TableCell>
                        <TableCell>{getArtistName(record.artistId)}</TableCell>
                        <TableCell>{formatAmount(record.amount, record.currency)}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditMembershipFee(record)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMembershipFee(record.id)}
                              disabled={deleteMembershipFee.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice Records</CardTitle>
                  <CardDescription>Track invoices for artist services and media.</CardDescription>
                </div>
                <Button onClick={() => setInvoiceDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {invoicesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load invoice records: {invoicesError instanceof Error ? invoicesError.message : 'Unknown error'}. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : invoicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No invoice records found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Artist/Member</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.timestamp)}</TableCell>
                        <TableCell>{getArtistName(record.artistId)}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                        <TableCell>{formatAmount(record.amount, record.currency)}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(record)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteInvoice(record.id)}
                              disabled={deleteInvoice.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payout Records</CardTitle>
                  <CardDescription>Track artist payouts and financial transactions.</CardDescription>
                </div>
                <Button onClick={() => setPayoutDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {payoutsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load payout records: {payoutsError instanceof Error ? payoutsError.message : 'Unknown error'}. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : payoutsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No payout records found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Artist/Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.timestamp)}</TableCell>
                        <TableCell>{getArtistName(record.artistId)}</TableCell>
                        <TableCell>{formatAmount(record.amount, record.currency)}</TableCell>
                        <TableCell>{record.payoutMethod}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.destinationAccount}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPayout(record)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePayout(record.id)}
                              disabled={deletePayout.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MembershipFeeRecordDialog
        open={membershipFeeDialogOpen}
        onOpenChange={handleMembershipFeeDialogClose}
        editingRecord={editingMembershipFee}
      />
      <InvoiceRecordDialog open={invoiceDialogOpen} onOpenChange={handleInvoiceDialogClose} editingRecord={editingInvoice} />
      <PayoutRecordDialog open={payoutDialogOpen} onOpenChange={handlePayoutDialogClose} editingRecord={editingPayout} />
    </div>
  );
}
