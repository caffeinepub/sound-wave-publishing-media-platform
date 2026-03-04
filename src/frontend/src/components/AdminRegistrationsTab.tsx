import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Loader2, Ticket } from "lucide-react";
import { useGetAllEventRegistrations } from "../hooks/useQueries";

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminRegistrationsTab() {
  const {
    data: registrations = [],
    isLoading,
    error,
  } = useGetAllEventRegistrations();

  const handleExportCSV = () => {
    const headers = [
      "Attendee Name",
      "Email",
      "Tickets",
      "Total Paid ($)",
      "Status",
      "Date",
    ];
    const rows = registrations.map((r) => [
      r.attendeeName,
      r.email,
      r.ticketQuantity.toString(),
      r.totalPaid.toFixed(2),
      r.paymentStatus,
      new Date(r.timestamp).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    downloadCSV(
      csv,
      `event-registrations-${new Date().toISOString().split("T")[0]}.csv`,
    );
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Event Registrations
            </CardTitle>
            <CardDescription className="mt-1">
              All event registrations and their payment status
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={registrations.length === 0}
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
            Failed to load registrations. Please try again.
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No event registrations yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Attendee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((r) => (
                  <TableRow
                    key={`${r.email}-${r.timestamp}`}
                    className="border-border"
                  >
                    <TableCell className="font-medium">
                      {r.attendeeName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.email}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.ticketQuantity}
                    </TableCell>
                    <TableCell className="text-right text-primary font-semibold">
                      ${r.totalPaid.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          r.paymentStatus === "paid"
                            ? "bg-primary/20 text-primary border-primary/30 text-xs"
                            : "bg-muted text-muted-foreground text-xs"
                        }
                      >
                        {r.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(r.timestamp).toLocaleDateString()}
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
