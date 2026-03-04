import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Award,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  DollarSign,
  Info,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface PayoutRow {
  date: string;
  tier: string;
  shares: number;
  rate: string;
  amount: string;
  status: "Paid" | "Pending" | "Claimable";
}

const PAYOUT_HISTORY: PayoutRow[] = [
  {
    date: "Jan 1, 2026",
    tier: "Common",
    shares: 2,
    rate: "5%",
    amount: "$0.10",
    status: "Paid",
  },
  {
    date: "Oct 1, 2025",
    tier: "Common",
    shares: 1,
    rate: "5%",
    amount: "$0.05",
    status: "Paid",
  },
  {
    date: "Jul 1, 2025",
    tier: "Common",
    shares: 1,
    rate: "5%",
    amount: "$0.05",
    status: "Paid",
  },
  {
    date: "Apr 1, 2025",
    tier: "Common",
    shares: 1,
    rate: "5%",
    amount: "$0.05",
    status: "Paid",
  },
  {
    date: "Jan 1, 2025",
    tier: "Common",
    shares: 1,
    rate: "5%",
    amount: "$0.05",
    status: "Paid",
  },
];

const DIVIDEND_RATES = [
  {
    tier: "Founder Shares",
    rate: "12%",
    icon: <Crown className="h-4 w-4 text-yellow-400" />,
    color: "text-yellow-400",
  },
  {
    tier: "Preferred Shares",
    rate: "8%",
    icon: <Star className="h-4 w-4 text-blue-300" />,
    color: "text-blue-300",
  },
  {
    tier: "Common Shares",
    rate: "5%",
    icon: <Award className="h-4 w-4 text-green-300" />,
    color: "text-green-300",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function EarningsDashboardPage() {
  const [isClaiming, setIsClaiming] = useState(false);
  const claimableBalance = 0.0;
  const totalEarned = 0.3;
  const sharesOwned = 2;

  const handleClaim = async () => {
    if (claimableBalance <= 0) return;
    setIsClaiming(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsClaiming(false);
    toast.success("Dividends claimed successfully!");
  };

  return (
    <div className="min-h-screen py-12" data-ocid="earnings.page">
      <div className="container max-w-5xl space-y-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <TrendingUp className="h-3 w-3" />
            Earnings &amp; Dividends
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Earnings Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your dividend earnings, claim payouts, and review your
            distribution history from Sound Waves Publishing &amp; Media.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          data-ocid="earnings.stats.panel"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-border bg-gradient-to-br from-primary/10 to-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Total Dividends Earned
                    </p>
                    <p className="font-display text-2xl font-bold text-primary">
                      ${totalEarned.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/15 p-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Claimable Balance
                    </p>
                    <p className="font-display text-2xl font-bold">
                      ${claimableBalance.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Shares Owned
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {sharesOwned}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Common Shares
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <Award className="h-5 w-5 text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Next Payout Date
                    </p>
                    <p className="font-display text-lg font-bold leading-tight">
                      Apr 1, 2026
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quarterly Schedule
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Claimable Dividends Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Claimable Dividends
              </CardTitle>
              <CardDescription>
                Dividends are distributed quarterly based on your share
                ownership and the company's revenue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-5">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Available to Claim
                  </p>
                  <p className="font-display text-4xl font-bold text-primary">
                    ${claimableBalance.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Next distribution: April 1, 2026
                  </p>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          onClick={handleClaim}
                          disabled={claimableBalance <= 0 || isClaiming}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                          size="lg"
                          data-ocid="earnings.claim.button"
                        >
                          {isClaiming ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                              Claiming...
                            </>
                          ) : (
                            "Claim Dividends"
                          )}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {claimableBalance <= 0 && (
                      <TooltipContent>
                        <p>No dividends available to claim</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/10 p-3 text-xs text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                Dividends are distributed quarterly based on your share
                ownership and the company's revenue. Each Common Share earns 5%
                annual dividend, Preferred Shares earn 8%, and Founder Shares
                earn 12%.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payout History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold">Payout History</h2>
            <p className="text-sm text-muted-foreground">
              Complete record of dividend distributions to your account
            </p>
          </div>
          <Card
            className="border-border overflow-hidden"
            data-ocid="earnings.history.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 border-border">
                  <TableHead className="font-semibold text-foreground">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Share Tier
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Shares
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Rate
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PAYOUT_HISTORY.map((row, index) => (
                  <TableRow
                    key={row.date}
                    className="border-border hover:bg-muted/20"
                    data-ocid={`earnings.history.row.${index + 1}`}
                  >
                    <TableCell className="font-medium">{row.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-green-300" />
                        <span className="text-sm">{row.tier}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {row.shares}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs font-mono">
                        {row.rate}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium font-mono">
                      {row.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={
                          row.status === "Paid"
                            ? "bg-green-800/30 text-green-300 border-green-700/40 text-xs"
                            : row.status === "Claimable"
                              ? "bg-primary/20 text-primary border-primary/30 text-xs"
                              : "bg-muted/50 text-muted-foreground border-border text-xs"
                        }
                      >
                        {row.status === "Paid" && (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        )}
                        {row.status === "Pending" && (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>

        {/* Dividend Rates Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border" data-ocid="earnings.rates.panel">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Dividend Rate Reference
              </CardTitle>
              <CardDescription>
                Annual dividend rates by share tier — distributed quarterly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DIVIDEND_RATES.map((item, i) => (
                  <div key={item.tier}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.tier}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-display text-2xl font-bold ${item.color}`}
                        >
                          {item.rate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          per year
                        </span>
                      </div>
                    </div>
                    {i < DIVIDEND_RATES.length - 1 && (
                      <Separator className="opacity-30" />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground border-t border-border/50 pt-4">
                Dividends are calculated quarterly. Annual rates shown are based
                on par value of $1.00 per share. Actual payout amounts depend on
                company revenue and board declarations. Distributions are
                subject to the company's financial performance.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
