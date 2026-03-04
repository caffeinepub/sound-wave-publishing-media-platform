import SwpmTickerChip from "@/components/SwpmTickerChip";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  AlertTriangle,
  Award,
  Building2,
  Crown,
  DollarSign,
  Info,
  Mail,
  Percent,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const OWNERSHIP_ROWS = [
  {
    holder: "RTS Enterprises (Mr. Robin T. Harding Smith)",
    shareClass: "Founder Shares",
    shares: "7,000,000",
    percentage: "70%",
    icon: <Crown className="h-4 w-4 text-yellow-400" />,
    badgeClass: "bg-yellow-900/30 text-yellow-400 border-yellow-700/40",
    note: "Controlling interest — not for sale",
  },
  {
    holder: "Mildred Harding Estate and Small Business Trust (ESBT)",
    shareClass: "Preferred Shares",
    shares: "2,000,000",
    percentage: "20%",
    icon: <Star className="h-4 w-4 text-blue-300" />,
    badgeClass: "bg-blue-900/30 text-blue-300 border-blue-700/40",
    note: "Trustee: Mr. Robin T. Harding Smith",
  },
  {
    holder: "508(c)(1)(A) Faith-Based Organization",
    shareClass: "Preferred Shares",
    shares: "1,000,000",
    percentage: "10%",
    icon: <Star className="h-4 w-4 text-blue-300" />,
    badgeClass: "bg-blue-900/30 text-blue-300 border-blue-700/40",
    note: "501(c)(3) entity — pays UBIT on S-corp income",
  },
  {
    holder: "Participating Artists (Available Pool)",
    shareClass: "Common Shares",
    shares: "Up to 3,000,000",
    percentage: "Up to 30%",
    icon: <Award className="h-4 w-4 text-green-300" />,
    badgeClass: "bg-green-900/30 text-green-300 border-green-700/40",
    note: "Min 1 share · Max 7 shares per artist · Must submit 15 musical pieces",
  },
];

const DIVIDEND_TIERS = [
  {
    tier: "Founder Shares",
    rate: "12%",
    schedule: "Quarterly (Jan · Apr · Jul · Oct)",
    color: "text-yellow-400",
    barColor: "bg-yellow-500/50",
    barWidth: "w-[100%]",
    icon: <Crown className="h-5 w-5 text-yellow-400" />,
    badgeClass: "bg-yellow-900/30 text-yellow-400 border-yellow-700/40",
    description: "Highest priority — full voting rights and first distribution",
  },
  {
    tier: "Preferred Shares",
    rate: "8%",
    schedule: "Quarterly (Jan · Apr · Jul · Oct)",
    color: "text-blue-300",
    barColor: "bg-blue-500/50",
    barWidth: "w-[67%]",
    icon: <Star className="h-5 w-5 text-blue-300" />,
    badgeClass: "bg-blue-900/30 text-blue-300 border-blue-700/40",
    description: "Priority distribution with accelerated payout schedule",
  },
  {
    tier: "Common Shares",
    rate: "5%",
    schedule: "Quarterly (Jan · Apr · Jul · Oct)",
    color: "text-green-300",
    barColor: "bg-green-500/50",
    barWidth: "w-[42%]",
    icon: <Award className="h-5 w-5 text-green-300" />,
    badgeClass: "bg-green-900/30 text-green-300 border-green-700/40",
    description: "Standard rate — available to eligible participating artists",
  },
];

export default function InvestorRelationsPage() {
  return (
    <div className="min-h-screen py-12" data-ocid="investor-relations.page">
      <div className="container max-w-5xl space-y-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <TrendingUp className="h-3 w-3" />
            Investor Relations
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight">
            Investor Relations
          </h1>
          <p className="text-lg text-muted-foreground font-display italic tracking-wide">
            Sound Waves Publishing &amp; Media
          </p>
          <SwpmTickerChip />
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Official investor relations portal for Sound Waves Publishing &amp;
            Media, a subsidiary of RTS Enterprises. Review share structure,
            dividend rates, ownership breakdown, and company information.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Company Overview Card */}
          <motion.div variants={cardVariants}>
            <Card
              className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card"
              data-ocid="investor-relations.overview.card"
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Company Overview
                </CardTitle>
                <CardDescription>
                  Corporate structure and key company details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      label: "Company Name",
                      value: "Sound Waves Publishing & Media",
                    },
                    {
                      label: "Proposed Ticker Symbol",
                      value: (
                        <span className="font-mono font-bold text-amber-400 tracking-widest">
                          SWPM
                        </span>
                      ),
                    },
                    { label: "Incorporation Type", value: "S-Corporation" },
                    {
                      label: "Parent Company",
                      value: "RTS Enterprises (Research Technological Systems)",
                    },
                    {
                      label: "Parent Type",
                      value: "Privately Held For-Profit Holding Company",
                    },
                    {
                      label: "Founder & CEO",
                      value: "Mr. Robin T. Harding Smith",
                    },
                    { label: "Par Value per Share", value: "$1.00 USD" },
                    {
                      label: "Total Authorized Shares",
                      value: "10,000,000",
                    },
                    {
                      label: "Total Equity Value",
                      value: "$10,000,000 USD",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-border/60 bg-background/30 p-3.5 space-y-1"
                    >
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        {label}
                      </p>
                      <p className="text-sm font-semibold leading-snug">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-5 opacity-30" />

                <div className="rounded-lg border border-border/50 bg-muted/10 p-4 text-xs text-muted-foreground italic leading-relaxed">
                  <strong className="not-italic text-foreground/70">
                    Statement:{" "}
                  </strong>
                  RTS Enterprises is a privately held for-profit business entity
                  serving as the parent holding company of Sound Waves
                  Publishing &amp; Media.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ownership Structure Card */}
          <motion.div variants={cardVariants}>
            <Card
              className="border-border overflow-hidden"
              data-ocid="investor-relations.ownership.card"
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Ownership Structure
                </CardTitle>
                <CardDescription>
                  10,000,000 total authorized shares at $1.00 par value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 border-border">
                      <TableHead className="font-semibold text-foreground">
                        Shareholder
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Share Class
                      </TableHead>
                      <TableHead className="font-semibold text-foreground text-right">
                        Shares
                      </TableHead>
                      <TableHead className="font-semibold text-foreground text-right">
                        %
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OWNERSHIP_ROWS.map((row, i) => (
                      <TableRow
                        key={row.holder}
                        className="border-border hover:bg-muted/20 align-top"
                        data-ocid={`investor-relations.ownership.row.${i + 1}`}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-start gap-2">
                            {row.icon}
                            <div className="space-y-0.5">
                              <p className="font-medium text-sm leading-snug">
                                {row.holder}
                              </p>
                              <p className="text-xs text-muted-foreground/70 italic">
                                {row.note}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`border text-xs ${row.badgeClass}`}>
                            {row.shareClass}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm py-4">
                          {row.shares}
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm py-4">
                          {row.percentage}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Visual breakdown bar */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Equity Distribution
                  </p>
                  <div className="flex h-5 w-full overflow-hidden rounded-full border border-border/40">
                    <div
                      className="h-full bg-yellow-500/60"
                      style={{ width: "70%" }}
                      title="Founder — 70%"
                    />
                    <div
                      className="h-full bg-blue-500/50"
                      style={{ width: "20%" }}
                      title="Trust — 20%"
                    />
                    <div
                      className="h-full bg-indigo-500/40"
                      style={{ width: "10%" }}
                      title="Faith-Based Org — 10%"
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2.5 w-2.5 rounded-sm bg-yellow-500/60" />
                      RTS Enterprises / Founder — 70%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500/50" />
                      Mildred Harding ESBT — 20%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500/40" />
                      508(c)(1)(A) Organization — 10%
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/10 p-3.5 text-xs text-muted-foreground">
                  <strong className="text-foreground/70">Artist Pool:</strong>{" "}
                  Up to 3,000,000 Common Shares are available to participating
                  artists who have submitted 15 musical pieces. Artists may
                  purchase a minimum of 1 share and a maximum of 7 shares. The
                  first 100 eligible artists each receive 1 free share.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dividend Rates Card */}
          <motion.div variants={cardVariants}>
            <Card
              className="border-border"
              data-ocid="investor-relations.dividends.card"
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  Dividend Rates &amp; Distribution Schedule
                </CardTitle>
                <CardDescription>
                  Annual rates by share tier — distributed on a quarterly basis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  {DIVIDEND_TIERS.map((tier, i) => (
                    <div key={tier.tier}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5">
                            {tier.icon}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-medium">{tier.tier}</p>
                            <p className="text-xs text-muted-foreground">
                              {tier.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`font-display text-3xl font-bold ${tier.color}`}
                          >
                            {tier.rate}
                          </span>
                          <Badge
                            className={`border text-xs whitespace-nowrap ${tier.badgeClass}`}
                          >
                            Quarterly
                          </Badge>
                        </div>
                      </div>
                      {/* Rate bar */}
                      <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full ${tier.barColor} ${tier.barWidth} transition-all duration-700`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground/70 pl-1">
                        {tier.schedule}
                      </p>
                      {i < DIVIDEND_TIERS.length - 1 && (
                        <Separator className="mt-4 opacity-20" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/10 p-4 text-xs text-muted-foreground flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                  <span>
                    Dividend payments are calculated quarterly based on par
                    value of $1.00 per share. Actual payout amounts are subject
                    to the company's financial performance and board
                    declarations. All distributions are governed by the
                    company's shareholder agreement and applicable securities
                    regulations.
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Important Disclaimer Card */}
          <motion.div variants={cardVariants}>
            <Card
              className="border-2 border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-card to-card"
              data-ocid="investor-relations.disclaimer.card"
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-300">Important Disclaimer</span>
                </CardTitle>
                <CardDescription>
                  Please read carefully before making any investment decisions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-amber-700/40 bg-amber-950/20">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-sm leading-relaxed ml-2">
                    <strong className="text-amber-300 block mb-1">
                      Shares Are Not Publicly Traded
                    </strong>
                    Sound Waves Publishing &amp; Media shares (proposed ticker:{" "}
                    <span className="font-mono font-bold text-amber-400">
                      SWPM
                    </span>
                    ) are privately held and are{" "}
                    <strong>
                      NOT currently listed on any public stock exchange.
                    </strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <span className="font-medium text-foreground/80">
                      Future Listing:
                    </span>{" "}
                    The company is pursuing future exchange listing. This
                    process requires SEC registration, audited financial
                    statements, and legal counsel specializing in securities
                    law.
                  </p>
                  <p>
                    <span className="font-medium text-foreground/80">
                      No Guarantee of Liquidity:
                    </span>{" "}
                    Purchasing shares does not guarantee future liquidity or
                    public listing. Prospective investors should consult a
                    licensed securities attorney before making any investment
                    decisions.
                  </p>
                  <p>
                    <span className="font-medium text-foreground/80">
                      Regulatory Compliance:
                    </span>{" "}
                    Share transactions are governed by the company's shareholder
                    agreement and applicable securities regulations. All sales
                    are processed manually to ensure compliance.
                  </p>
                  <p>
                    <span className="font-medium text-foreground/80">
                      Artist Shares ($40 Membership):
                    </span>{" "}
                    A $40 membership fee to RTS Enterprises Sound Waves
                    Publishing and Media is a prerequisite for artist payouts
                    and invoices. The membership fee equals the price of one
                    share.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Investor Inquiries Card */}
          <motion.div variants={cardVariants}>
            <Card
              className="border-border"
              data-ocid="investor-relations.contact.card"
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Investor Inquiries
                </CardTitle>
                <CardDescription>
                  Contact the investor relations team for share inquiries and
                  information requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 bg-background/30 p-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      General Inquiries
                    </p>
                    <p className="font-mono text-sm font-semibold text-primary">
                      admin@soundwavesmedia.com
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Common Share purchases and general investor questions
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-700/30 bg-blue-950/10 p-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      Preferred Share Inquiries
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-300 shrink-0" />
                      <p className="text-sm font-semibold text-blue-300">
                        By Invitation Only
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact via the general email to request consideration for
                      Preferred Share allocation
                    </p>
                  </div>
                </div>

                <Separator className="opacity-30" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button
                    asChild
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-ocid="investor-relations.contact.button"
                  >
                    <a href="mailto:admin@soundwavesmedia.com?subject=SWPM%20Investor%20Inquiry">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Investor Relations
                    </a>
                  </Button>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground max-w-sm">
                    <DollarSign className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                    Founder Shares are not available for purchase. Preferred
                    Share inquiries are by invitation only.
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
