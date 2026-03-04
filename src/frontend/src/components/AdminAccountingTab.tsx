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
import { Download, Loader2, Receipt } from "lucide-react";
import { useGetAccountingLog } from "../hooks/useQueries";

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const typeColorMap: Record<string, string> = {
  event_ticket: "bg-primary/20 text-primary border-primary/30",
  share_purchase: "bg-primary/30 text-primary border-primary/40",
  free_share: "bg-muted text-muted-foreground border-border",
  membership_fee: "bg-muted text-muted-foreground border-border",
};

export default function AdminAccountingTab() {
  const { data: transactions = [], isLoading, error } = useGetAccountingLog();

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    const headers = ["Transaction Type", "Amount ($)", "User", "Date"];
    const rows = transactions.map((t) => [
      t.transactionType,
      t.amount.toFixed(2),
      t.userPrincipal,
      new Date(t.timestamp).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    downloadCSV(
      csv,
      `accounting-log-${new Date().toISOString().split("T")[0]}.csv`,
    );
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Accounting Log
            </CardTitle>
            <CardDescription className="mt-1">
              All financial transactions — Total Revenue:{" "}
              <span className="text-primary font-semibold">
                ${totalRevenue.toFixed(2)}
              </span>
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
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
            Failed to load accounting log. Please try again.
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow
                    key={`${t.userPrincipal}-${t.timestamp}`}
                    className="border-border"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${typeColorMap[t.transactionType] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {t.transactionType.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono max-w-[160px] truncate">
                      {t.userPrincipal}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(t.timestamp).toLocaleDateString()}
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
