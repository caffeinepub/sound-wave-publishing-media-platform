import SwpmTickerChip from "@/components/SwpmTickerChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Award,
  Crown,
  DollarSign,
  Info,
  Lock,
  Mail,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const COMPARISON_ROWS = [
  {
    feature: "Price / Share",
    founder: "$1.00",
    preferred: "$1.00",
    common: "$1.00",
  },
  {
    feature: "Dividend Rate",
    founder: "12%",
    preferred: "8%",
    common: "5%",
  },
  {
    feature: "Availability",
    founder: "Founder Only",
    preferred: "Limited",
    common: "Open to Artists",
  },
  {
    feature: "Min Purchase",
    founder: "N/A",
    preferred: "N/A",
    common: "1 share",
  },
  {
    feature: "Max Purchase",
    founder: "N/A",
    preferred: "N/A",
    common: "7 shares",
  },
  {
    feature: "Voting Rights",
    founder: "Full",
    preferred: "Limited",
    common: "None",
  },
];

const PRICE_HISTORY = [
  { quarter: "Q1 2025", common: "$1.00", preferred: "$1.00", founder: "$1.00" },
  { quarter: "Q2 2025", common: "$1.00", preferred: "$1.00", founder: "$1.00" },
  { quarter: "Q3 2025", common: "$1.00", preferred: "$1.00", founder: "$1.00" },
  { quarter: "Q4 2025", common: "$1.00", preferred: "$1.00", founder: "$1.00" },
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

export default function ShareMarketplacePage() {
  const { actor } = useActor();
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);

  const pricePerShare = 1.0;
  const totalPrice = (quantity * pricePerShare).toFixed(2);

  const handleQuantityChange = (val: string) => {
    const num = Number.parseInt(val, 10);
    if (!Number.isNaN(num)) {
      setQuantity(Math.min(7, Math.max(1, num)));
    }
  };

  const handleBuyShares = async () => {
    if (!actor) {
      toast.error("Not connected. Please log in to purchase shares.");
      return;
    }
    setIsBuying(true);
    try {
      const url = await actor.createCheckoutSession(
        [
          {
            productName: "Common Share",
            currency: "usd",
            quantity: BigInt(quantity),
            priceInCents: 100n,
            productDescription: "Sound Waves Publishing & Media Common Share",
          },
        ],
        `${window.location.origin}/share-purchase-success`,
        `${window.location.origin}/share-purchase-failure`,
      );
      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Unable to start checkout. Please try again.");
      setIsBuying(false);
    }
  };

  const handleContactAdmin = () => {
    toast.info("Contact admin@soundwavesmedia.com to sell your shares.");
  };

  return (
    <div className="min-h-screen py-12" data-ocid="marketplace.page">
      <div className="container max-w-5xl space-y-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <TrendingUp className="h-3 w-3" />
            Share Marketplace
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Share Marketplace
          </h1>
          <SwpmTickerChip />
          <p className="text-muted-foreground">
            Purchase equity shares in Sound Waves Publishing &amp; Media. Common
            Shares are available to eligible artists who have submitted 15
            musical pieces.
          </p>
        </motion.div>

        {/* Tier Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <h2 className="font-display text-2xl font-bold">
            Share Tier Comparison
          </h2>
          <Card
            className="border-border overflow-hidden"
            data-ocid="marketplace.comparison.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 border-border">
                  <TableHead className="font-semibold text-foreground">
                    Feature
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span>Founder</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Star className="h-4 w-4 text-blue-300" />
                      <span>Preferred</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Award className="h-4 w-4 text-green-300" />
                      <span>Common</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON_ROWS.map((row) => (
                  <TableRow
                    key={row.feature}
                    className="border-border hover:bg-muted/20"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {row.feature}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {row.founder}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {row.preferred}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-green-300">
                        {row.common}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>

        {/* Available Shares Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h2 className="font-display text-2xl font-bold">Available Shares</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Founder Card */}
            <motion.div variants={itemVariants}>
              <Card
                className="border-2 border-yellow-700/50 bg-gradient-to-br from-yellow-950/30 via-card to-card h-full flex flex-col"
                data-ocid="marketplace.founder.card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <CardTitle className="font-display text-lg">
                      Founder Shares
                    </CardTitle>
                  </div>
                  <CardDescription>Highest dividend tier</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <div className="text-center py-3 rounded-lg border border-yellow-700/30 bg-yellow-950/20">
                    <p className="font-display text-3xl font-bold text-yellow-400">
                      12%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Annual Dividend
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center py-4">
                    <div className="text-center space-y-2">
                      <Lock className="h-10 w-10 mx-auto text-yellow-700/60" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Reserved — Not for Sale
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Held exclusively by Mr. Robin T. Harding Smith
                      </p>
                    </div>
                  </div>
                  <Badge className="w-full justify-center py-2 bg-yellow-900/30 text-yellow-600 border-yellow-700/40 text-xs">
                    Founder Only
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferred Card */}
            <motion.div variants={itemVariants}>
              <Card
                className="border-2 border-blue-700/50 bg-gradient-to-br from-blue-950/30 via-card to-card h-full flex flex-col"
                data-ocid="marketplace.preferred.card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-300" />
                    <CardTitle className="font-display text-lg">
                      Preferred Shares
                    </CardTitle>
                  </div>
                  <CardDescription>Priority dividend tier</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <div className="text-center py-3 rounded-lg border border-blue-700/30 bg-blue-950/20">
                    <p className="font-display text-3xl font-bold text-blue-300">
                      8%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Annual Dividend
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center py-4">
                    <div className="text-center space-y-2">
                      <Mail className="h-10 w-10 mx-auto text-blue-700/60" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Contact Admin to Purchase
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        By invitation only — limited allocation
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-blue-700/40 text-blue-300 hover:bg-blue-950/30"
                    onClick={() =>
                      toast.info(
                        "Contact admin@soundwavesmedia.com for Preferred Share inquiries.",
                      )
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Admin
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Common Share Purchase Card */}
            <motion.div variants={itemVariants}>
              <Card
                className="border-2 border-green-700/50 bg-gradient-to-br from-green-950/30 via-card to-card h-full flex flex-col"
                data-ocid="marketplace.common.card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-300" />
                    <CardTitle className="font-display text-lg">
                      Common Shares
                    </CardTitle>
                  </div>
                  <CardDescription>Open to eligible artists</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <div className="text-center py-3 rounded-lg border border-green-700/30 bg-green-950/20">
                    <p className="font-display text-3xl font-bold text-green-300">
                      5%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Annual Dividend
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="share-qty"
                        className="text-sm font-medium"
                      >
                        Quantity (1–7 shares)
                      </Label>
                      <Input
                        id="share-qty"
                        type="number"
                        min={1}
                        max={7}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        className="border-border bg-background/50"
                        data-ocid="marketplace.common.quantity.input"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 px-3 py-2">
                      <span className="text-sm text-muted-foreground">
                        Total Price
                      </span>
                      <span className="font-display text-lg font-bold text-primary">
                        ${totalPrice}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <Info className="h-3 w-3 mt-0.5 shrink-0" />
                      Must have submitted 15 musical pieces to be eligible.
                      First 100 eligible artists receive 1 free share.
                    </p>
                  </div>

                  <Button
                    onClick={handleBuyShares}
                    disabled={isBuying}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto"
                    data-ocid="marketplace.common.buy.primary_button"
                  >
                    {isBuying ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy via Stripe
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Sell Shares Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border" data-ocid="marketplace.sell.panel">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Sell Your Shares
              </CardTitle>
              <CardDescription>
                Share sales are processed manually to ensure compliance with our
                shareholder agreement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To sell your shares, please contact administration. Share sales
                are processed manually to ensure compliance with our shareholder
                agreement and applicable securities regulations. Sale requests
                are reviewed within 5–10 business days.
              </p>
              <Separator className="opacity-30" />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="border-border hover:border-primary/50 hover:text-primary"
                  onClick={handleContactAdmin}
                  data-ocid="marketplace.sell.button"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Admin to Sell
                </Button>
                <p className="text-xs text-muted-foreground self-center sm:pl-2">
                  admin@soundwavesmedia.com
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Price History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold">
              Share Price History
            </h2>
            <p className="text-sm text-muted-foreground">
              Historical par value per share — Sound Waves Publishing &amp;
              Media
            </p>
          </div>
          <Card
            className="border-border overflow-hidden"
            data-ocid="marketplace.price_history.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 border-border">
                  <TableHead className="font-semibold text-foreground">
                    Quarter
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-green-300" />
                      Common
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-blue-300" />
                      Preferred
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-yellow-400" />
                      Founder
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRICE_HISTORY.map((row) => (
                  <TableRow
                    key={row.quarter}
                    className="border-border hover:bg-muted/20"
                  >
                    <TableCell className="font-medium">{row.quarter}</TableCell>
                    <TableCell className="text-center font-mono text-green-300">
                      {row.common}
                    </TableCell>
                    <TableCell className="text-center font-mono text-blue-300">
                      {row.preferred}
                    </TableCell>
                    <TableCell className="text-center font-mono text-yellow-400">
                      {row.founder}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Visual bar chart placeholder */}
          <div className="rounded-lg border border-border bg-muted/10 p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Price Stability Overview
            </p>
            {(["Common", "Preferred", "Founder"] as const).map((tier) => {
              const color =
                tier === "Common"
                  ? "bg-green-500/40"
                  : tier === "Preferred"
                    ? "bg-blue-500/40"
                    : "bg-yellow-500/40";
              const textColor =
                tier === "Common"
                  ? "text-green-300"
                  : tier === "Preferred"
                    ? "text-blue-300"
                    : "text-yellow-400";
              return (
                <div key={tier} className="flex items-center gap-3">
                  <span className={`text-xs w-20 font-medium ${textColor}`}>
                    {tier}
                  </span>
                  <div className="flex-1 h-6 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-700`}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                    $1.00
                  </span>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground/60 italic">
              Share price has remained stable at par value since inception.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
