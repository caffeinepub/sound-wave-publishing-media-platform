import { useGetAllShareholders } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Users, Loader2 } from 'lucide-react';

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminShareholdersTab() {
  const { data: shareholders = [], isLoading, error } = useGetAllShareholders();

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Shares Owned', 'Total Paid ($)', 'Free Share'];
    const rows = shareholders.map((s) => [
      s.name,
      s.email,
      s.sharesOwned.toString(),
      s.totalPaid.toFixed(2),
      s.receivedFreeShare ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    downloadCSV(csv, `shareholders-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Shareholders
            </CardTitle>
            <CardDescription className="mt-1">
              All artists who own shares in Sound Waves Publishing &amp; Media
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={shareholders.length === 0}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-destructive">
            Failed to load shareholders. Please try again.
          </div>
        ) : shareholders.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No shareholders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Shares Owned</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                  <TableHead>Free Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shareholders.map((s, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    <TableCell className="text-right text-primary font-semibold">{s.sharesOwned}</TableCell>
                    <TableCell className="text-right">${s.totalPaid.toFixed(2)}</TableCell>
                    <TableCell>
                      {s.receivedFreeShare ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
