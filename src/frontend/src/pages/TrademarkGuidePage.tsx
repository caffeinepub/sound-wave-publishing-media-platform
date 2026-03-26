import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  BookOpen,
  CheckSquare,
  ExternalLink,
  FileText,
  Globe,
  Scale,
  Shield,
  Star,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

const checklistSteps = [
  {
    step: 1,
    title: "Determine Your Mark Type",
    description:
      'Decide whether to register a word mark (the name "Sound Wave Publishing & Media" or "SWPM"), a design mark (logo/visual), or both. Word marks offer broader protection; design marks protect the specific visual identity.',
  },
  {
    step: 2,
    title: "Conduct a Trademark Search",
    description:
      "Search the USPTO TESS database to ensure no confusingly similar marks are already registered in your target classes. A clearance search protects you from costly conflicts after filing.",
    link: { label: "Open USPTO TESS →", href: "https://tmsearch.uspto.gov" },
  },
  {
    step: 3,
    title: "Identify International Class(es)",
    description:
      "Select the correct Nice Classification classes for your goods/services. Recommended classes for Sound Wave Publishing & Media:",
    classes: [
      {
        code: "Class 41",
        desc: "Entertainment, Education & Publishing Services",
      },
      { code: "Class 38", desc: "Telecommunications & Broadcasting" },
      { code: "Class 9", desc: "Digital Media, Recordings & Software" },
    ],
  },
  {
    step: 4,
    title: "Prepare Your Application",
    description:
      "Gather required information: owner's full legal name and address (Mr. Robin T. Harding Smith / RTS Enterprises), a clear description of goods/services, a specimen showing the mark in use in commerce (e.g., a screenshot of your platform), and the date of first use.",
  },
  {
    step: 5,
    title: "File Online via TEAS",
    description:
      "Submit your application through the Trademark Electronic Application System (TEAS). TEAS Plus ($250/class) requires all fields completed upfront; TEAS Standard ($350/class) allows some fields to be completed later. TEAS Plus is recommended for cost savings.",
    link: {
      label: "Go to USPTO TEAS →",
      href: "https://www.uspto.gov/trademarks",
    },
  },
  {
    step: 6,
    title: "Pay Filing Fees",
    description:
      "Filing fees are per class: $250/class (TEAS Plus) or $350/class (TEAS Standard). For three classes (9, 38, 41), expect $750–$1,050 in USPTO fees. Attorney fees, if retained, are separate.",
    highlight: "$250–$350 per class",
  },
  {
    step: 7,
    title: "Monitor & Respond to Office Actions",
    description:
      "After filing, a USPTO examining attorney reviews the application. If issues arise (likelihood of confusion, descriptiveness, etc.), an Office Action is issued. You typically have 3 months to respond (extendable to 6 months for a fee). USPTO review takes approximately 3–6 months from filing.",
  },
  {
    step: 8,
    title: "Publication for Opposition",
    description:
      "If approved, the mark is published in the Official Gazette for 30 days. Third parties may file an opposition during this window. If no opposition is filed (or any opposition is resolved in your favor), the mark proceeds to registration.",
  },
  {
    step: 9,
    title: "Registration Certificate Issued",
    description:
      "Upon successful registration, you receive a Certificate of Registration. The registration is valid for 10 years and must be renewed between years 5–6 (Section 8 declaration required) and again at 10 years. Registrations may be renewed indefinitely every 10 years.",
    highlight: "Valid 10 years — renewable indefinitely",
  },
];

const resources = [
  {
    name: "USPTO.gov",
    desc: "U.S. Patent & Trademark Office — the official authority for federal trademark registration.",
    href: "https://www.uspto.gov",
    icon: Shield,
  },
  {
    name: "TEAS Filing System",
    desc: "File your trademark application online directly through the Trademark Electronic Application System.",
    href: "https://www.uspto.gov/trademarks/apply",
    icon: FileText,
  },
  {
    name: "ICANN UDRP",
    desc: "Uniform Domain-Name Dispute-Resolution Policy — challenge bad-faith domain registrations using your trademark.",
    href: "https://www.icann.org/resources/pages/udrp-2012-02-25-en",
    icon: Globe,
  },
  {
    name: "WIPO — World IP Organization",
    desc: "Pursue international trademark protection via the Madrid System for marks used across multiple countries.",
    href: "https://www.wipo.int",
    icon: Star,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function TrademarkGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <div
            className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 60px, oklch(var(--primary)) 60px, oklch(var(--primary)) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, oklch(var(--primary)) 60px, oklch(var(--primary)) 61px)",
            }}
          />
        </div>

        <div className="container relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-primary/30 bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <Badge
                variant="outline"
                className="border-primary/40 text-primary text-xs tracking-widest uppercase"
              >
                Legal Resources
              </Badge>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Trademark Filing{" "}
              <span className="text-primary italic">Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Protect the legacy you've built. Registering a federal trademark
              for{" "}
              <strong className="text-foreground">
                "Sound Wave Publishing & Media"
              </strong>{" "}
              and the stock ticker{" "}
              <strong className="text-primary">SWPM</strong> establishes your
              exclusive nationwide rights to these identifiers — giving you the
              legal standing to defend your brand, your domain, and your
              creative identity for generations to come.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container py-16 space-y-20">
        {/* Why Trademark? */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          data-ocid="trademark.why_section"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Why Register a Trademark?
              </h2>
            </div>
            <Separator className="mb-8 bg-border/60" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: FileText,
                title: "Copyright vs. Trademark",
                body: 'Copyright automatically protects your original creative works — songs, lyrics, art, and literature — from the moment of creation. Trademarks protect something different: your brand identity. The name "Sound Wave Publishing & Media," the ticker "SWPM," and any distinctive logos are trademark territory, not copyright.',
              },
              {
                icon: Shield,
                title: "Nationwide Legal Standing",
                body: "A federal USPTO registration gives you the presumption of exclusive nationwide ownership. You can use the ® symbol, pursue infringers in federal court, and block infringing imports through U.S. Customs. Without registration, your rights are limited to the geographic area where you actively use the mark.",
              },
              {
                icon: Globe,
                title: "Domain Name Protection (ICANN UDRP)",
                body: "Once your trademark is registered, you gain access to ICANN's Uniform Domain-Name Dispute-Resolution Policy. If a bad actor registers a confusingly similar domain (e.g., soundwavepublishingmedia.net) to profit from your brand, you can file a UDRP complaint to reclaim it — without costly litigation.",
              },
              {
                icon: Scale,
                title: "Brand Equity & Business Value",
                body: "Registered trademarks are business assets. They can be licensed to generate revenue, assigned when the company changes hands, and used as collateral. For a company with shares like SWPM, a registered trademark directly supports the valuation and defensibility of your intellectual property portfolio.",
              },
            ].map((card) => (
              <motion.div key={card.title} variants={itemVariants}>
                <Card className="h-full border-border/60 bg-card/80 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <card.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.body}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* USPTO Filing Checklist */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          data-ocid="trademark.checklist_section"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <CheckSquare className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                USPTO Filing Checklist
              </h2>
            </div>
            <Separator className="mb-8 bg-border/60" />
          </motion.div>

          <div className="space-y-4">
            {checklistSteps.map((item, i) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                data-ocid={`trademark.checklist.item.${i + 1}`}
              >
                <Card className="border-border/60 bg-card/80 hover:border-primary/20 transition-colors">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex gap-4">
                      {/* Step number */}
                      <div className="flex-shrink-0 flex items-start pt-0.5">
                        <div className="w-8 h-8 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary font-display">
                            {item.step}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground text-base">
                            {item.title}
                          </h3>
                          {item.highlight && (
                            <Badge className="bg-primary/15 text-primary border border-primary/30 text-xs font-medium">
                              {item.highlight}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>

                        {/* Class breakdown */}
                        {item.classes && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.classes.map((cls) => (
                              <div
                                key={cls.code}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/25 bg-primary/8"
                              >
                                <span className="text-xs font-bold text-primary">
                                  {cls.code}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  — {cls.desc}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* External link */}
                        {item.link && (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            {item.link.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ICANN UDRP Protection */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          data-ocid="trademark.udrp_section"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                ICANN UDRP Domain Protection
              </h2>
            </div>
            <Separator className="mb-8 bg-border/60" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-primary/25 bg-primary/5">
              <CardContent className="pt-6 pb-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Once your trademark is registered with the USPTO, you gain
                      access to ICANN's{" "}
                      <strong className="text-foreground">
                        Uniform Domain-Name Dispute-Resolution Policy (UDRP)
                      </strong>
                      . This is the international mechanism for reclaiming
                      domain names registered in bad faith using your brand.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      To prevail in a UDRP complaint, you must demonstrate three
                      elements: (1) the disputed domain is identical or
                      confusingly similar to your trademark; (2) the registrant
                      has no legitimate rights or interests in the domain; and
                      (3) the domain was registered and is being used in bad
                      faith. Your USPTO registration satisfies the first element
                      and substantially strengthens the others.
                    </p>
                    <a
                      href="https://www.icann.org/resources/pages/udrp-2012-02-25-en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                      data-ocid="trademark.udrp.link"
                    >
                      <Globe className="h-4 w-4" />
                      File a UDRP Complaint at ICANN
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="p-4 rounded-lg border border-primary/20 bg-background/50">
                      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">
                        UDRP Process
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1.5">
                        {[
                          "File complaint with ICANN-accredited provider",
                          "Respondent has 20 days to reply",
                          "Panel decision within 14 days",
                          "Domain transferred or cancelled if you win",
                          "Low cost vs. litigation ($1,500–$4,000 typical)",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-primary mt-1">›</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Key Resources */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          data-ocid="trademark.resources_section"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <ExternalLink className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Key Resources
              </h2>
            </div>
            <Separator className="mb-8 bg-border/60" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {resources.map((res, i) => (
              <motion.div key={res.name} variants={itemVariants}>
                <a
                  href={res.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={`trademark.resources.link.${i + 1}`}
                  className="group block h-full"
                >
                  <Card className="h-full border-border/60 bg-card/80 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
                          <res.icon className="h-4 w-4 text-primary" />
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1.5 group-hover:text-primary transition-colors">
                        {res.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {res.desc}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Legal Disclaimer */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          data-ocid="trademark.disclaimer_section"
        >
          <Card className="border-border/40 bg-muted/30">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-muted-foreground/80">
                    Legal Disclaimer:
                  </strong>{" "}
                  This page is for informational purposes only and does not
                  constitute legal advice. Trademark law is complex and
                  fact-specific. The information provided here is a general
                  overview and may not reflect the most current USPTO rules or
                  procedures. Consult a licensed intellectual property attorney
                  for guidance specific to your situation before filing any
                  trademark application.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
