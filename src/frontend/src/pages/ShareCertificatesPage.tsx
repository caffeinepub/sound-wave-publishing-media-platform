import SwpmTickerChip from "@/components/SwpmTickerChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, CheckCircle2, Crown, Star, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ShareTier {
  id: "founder" | "preferred" | "common";
  name: string;
  serialPrefix: string;
  dividendRate: string;
  pricePerShare: string;
  totalShares: string;
  sharesLabel: string;
  description: string;
  perks: string[];
  accentColor: string;
  badgeColor: string;
  icon: React.ReactNode;
  image: string;
  availability: string;
  tierDescription: string;
}

const SHARE_TIERS: ShareTier[] = [
  {
    id: "founder",
    name: "Founder Shares",
    serialPrefix: "FS-",
    dividendRate: "12%",
    pricePerShare: "$1.00",
    totalShares: "7,000,000",
    sharesLabel: "Founder Holdings",
    description: "Held by Mr. Robin T. Harding Smith, Founder & CEO",
    perks: [
      "Highest dividend priority (12% annual)",
      "Full voting rights on company decisions",
      "Exclusive founder benefit packages",
      "Priority in all distribution events",
      "Lifetime governance participation",
    ],
    accentColor:
      "border-yellow-700/60 bg-gradient-to-br from-yellow-950/40 via-card to-card",
    badgeColor: "bg-yellow-800/30 text-yellow-400 border-yellow-700/40",
    icon: <Crown className="h-5 w-5 text-yellow-400" />,
    image: "/assets/generated/founder-share-certificate.dim_800x560.jpg",
    availability: "Founder Only — Not for Sale",
    tierDescription:
      "Founder Shares represent the controlling interest in Sound Waves Publishing & Media. These shares are exclusively held by Mr. Robin T. Harding Smith as the company founder and CEO, carrying the highest dividend rate and full voting authority.",
  },
  {
    id: "preferred",
    name: "Preferred Shares",
    serialPrefix: "PS-",
    dividendRate: "8%",
    pricePerShare: "$1.00",
    totalShares: "Select Allocation",
    sharesLabel: "Preferred Pool",
    description: "Available to select investors by invitation",
    perks: [
      "Priority dividend distribution (8% annual)",
      "Preferred liquidation rights",
      "Accelerated payout schedule",
      "Preferential treatment in equity events",
      "Reserved for select company investors",
    ],
    accentColor:
      "border-blue-700/60 bg-gradient-to-br from-blue-950/40 via-card to-card",
    badgeColor: "bg-blue-800/30 text-blue-300 border-blue-700/40",
    icon: <Star className="h-5 w-5 text-blue-300" />,
    image: "/assets/generated/preferred-share-certificate.dim_800x560.jpg",
    availability: "By Invitation Only",
    tierDescription:
      "Preferred Shares are allocated to select company investors and carry priority rights in dividend distributions and liquidation events. These shares represent a mid-tier ownership stake with accelerated payout privileges.",
  },
  {
    id: "common",
    name: "Common Shares",
    serialPrefix: "CS-",
    dividendRate: "5%",
    pricePerShare: "$1.00",
    totalShares: "3,000,000",
    sharesLabel: "Available to Artists",
    description: "Open to eligible participating artists",
    perks: [
      "Standard dividend rights (5% annual)",
      "Ownership stake in the company",
      "Quarterly dividend distributions",
      "Artist community participation",
      "First 100 artists receive 1 free share",
    ],
    accentColor:
      "border-green-700/60 bg-gradient-to-br from-green-950/40 via-card to-card",
    badgeColor: "bg-green-800/30 text-green-300 border-green-700/40",
    icon: <Award className="h-5 w-5 text-green-300" />,
    image: "/assets/generated/common-share-certificate.dim_800x560.jpg",
    availability: "Open to Artists (min 1, max 7 shares)",
    tierDescription:
      "Common Shares are available to all participating artists who have submitted 15 or more musical pieces. These shares grant a standard ownership stake in Sound Waves Publishing & Media with quarterly dividend distributions.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ShareCertificatesPage() {
  const [selectedTier, setSelectedTier] = useState<ShareTier | null>(null);

  return (
    <div className="min-h-screen py-12" data-ocid="certificates.page">
      <div className="container max-w-6xl space-y-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <Award className="h-3 w-3" />
            Equity Ownership
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight">
            Equity Share Certificates
          </h1>
          <SwpmTickerChip className="mx-auto" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sound Waves Publishing &amp; Media — Authentic share certificates
            representing real equity ownership with tiered dividend rates and
            governance rights.
          </p>
        </motion.div>

        {/* Certificate Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-3"
        >
          {SHARE_TIERS.map((tier) => (
            <motion.div key={tier.id} variants={cardVariants}>
              <Card
                className={`border-2 overflow-hidden h-full flex flex-col ${tier.accentColor}`}
                data-ocid={`certificates.${tier.id}.card`}
              >
                {/* Certificate Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={tier.image}
                    alt={`${tier.name} Certificate`}
                    className="w-full object-cover"
                    style={{ height: "200px", objectPosition: "center top" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`text-xs font-medium border ${tier.badgeColor}`}
                    >
                      {tier.id === "founder" && (
                        <Crown className="mr-1 h-3 w-3" />
                      )}
                      {tier.id === "preferred" && (
                        <Star className="mr-1 h-3 w-3" />
                      )}
                      {tier.id === "common" && (
                        <Award className="mr-1 h-3 w-3" />
                      )}
                      {tier.name}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tier.icon}
                      <h2 className="font-display text-xl font-bold">
                        {tier.name}
                      </h2>
                    </div>
                    <span className="font-display text-2xl font-bold text-primary">
                      {tier.dividendRate}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Annual Dividend Rate
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 gap-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md border border-border/50 bg-background/30 p-2.5 text-center">
                      <p className="font-display text-lg font-bold text-primary">
                        {tier.pricePerShare}
                      </p>
                      <p className="text-xs text-muted-foreground">Per Share</p>
                    </div>
                    <div className="rounded-md border border-border/50 bg-background/30 p-2.5 text-center">
                      <p className="font-display text-lg font-bold">
                        {tier.totalShares}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tier.sharesLabel}
                      </p>
                    </div>
                  </div>

                  <Separator className="opacity-30" />

                  {/* Perks */}
                  <div className="space-y-1.5 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Key Benefits
                    </p>
                    <ul className="space-y-1">
                      {tier.perks.slice(0, 3).map((perk) => (
                        <li
                          key={perk}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-primary/70" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground/70 italic border-t border-border/40 pt-3">
                    {tier.availability}
                  </div>

                  <Button
                    onClick={() => setSelectedTier(tier)}
                    variant="outline"
                    className="w-full border-border/60 hover:border-primary/50 hover:text-primary transition-colors"
                    data-ocid={`certificates.${tier.id}.open_modal_button`}
                  >
                    View Certificate
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Share Structure Overview Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold">
              Share Structure Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Sound Waves Publishing &amp; Media — 10,000,000 Total Shares at
              $1.00/share
            </p>
          </div>
          <Card className="border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 border-border">
                  <TableHead className="font-semibold text-foreground">
                    Share Class
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Serial Prefix
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Dividend Rate
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Shares
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Price/Share
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Availability
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">Founder Shares</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">FS-XXXX</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-800/30 text-yellow-400 border-yellow-700/40">
                      12%
                    </Badge>
                  </TableCell>
                  <TableCell>7,000,000</TableCell>
                  <TableCell>$1.00</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    Founder Only
                  </TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-300" />
                      <span className="font-medium">Preferred Shares</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">PS-XXXX</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-800/30 text-blue-300 border-blue-700/40">
                      8%
                    </Badge>
                  </TableCell>
                  <TableCell>Select Allocation</TableCell>
                  <TableCell>$1.00</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    By Invitation
                  </TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-300" />
                      <span className="font-medium">Common Shares</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">CS-XXXX</TableCell>
                  <TableCell>
                    <Badge className="bg-green-800/30 text-green-300 border-green-700/40">
                      5%
                    </Badge>
                  </TableCell>
                  <TableCell>3,000,000</TableCell>
                  <TableCell>$1.00</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    Open to Artists
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3 text-center">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="font-display text-3xl font-bold text-primary">
                10,000,000
              </p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                Total Shares Authorized
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="font-display text-3xl font-bold">$10,000,000</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                Total Equity Value
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="font-display text-3xl font-bold">Quarterly</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                Dividend Distribution
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Certificate Detail Modal */}
      <Dialog
        open={!!selectedTier}
        onOpenChange={(open) => !open && setSelectedTier(null)}
      >
        <DialogContent
          className="max-w-2xl p-0 overflow-hidden border-border"
          data-ocid="certificates.modal"
        >
          {selectedTier && (
            <>
              {/* Certificate Image */}
              <div className="relative">
                <img
                  src={selectedTier.image}
                  alt={`${selectedTier.name} Certificate`}
                  className="w-full object-cover"
                  style={{ height: "300px", objectPosition: "center top" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTier(null)}
                    className="rounded-full bg-background/80 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="certificates.modal.close_button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-6">
                  <Badge
                    className={`text-sm border ${selectedTier.badgeColor}`}
                  >
                    {selectedTier.icon}
                    <span className="ml-1.5">{selectedTier.name}</span>
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-bold">
                    {selectedTier.name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedTier.description}
                  </p>
                </DialogHeader>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <p className="font-display text-xl font-bold text-primary">
                      {selectedTier.dividendRate}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Annual Dividend
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <p className="font-display text-xl font-bold">
                      {selectedTier.pricePerShare}
                    </p>
                    <p className="text-xs text-muted-foreground">Price/Share</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <p className="font-display text-lg font-bold">
                      {selectedTier.serialPrefix}0001
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sample Serial
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <p className="font-display text-lg font-bold">Quarterly</p>
                    <p className="text-xs text-muted-foreground">
                      Payout Period
                    </p>
                  </div>
                </div>

                {/* Tier Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedTier.tierDescription}
                </p>

                {/* All Perks */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    All Benefits &amp; Rights
                  </p>
                  <ul className="space-y-2">
                    {selectedTier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/10 p-3 text-xs text-muted-foreground italic">
                  <strong>Availability:</strong> {selectedTier.availability}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
