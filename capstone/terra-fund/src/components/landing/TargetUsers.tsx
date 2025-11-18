'use client'
import { Building2, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TargetUsers = () => {
  const segments = [
    {
      icon: Building2,
      title: "For NGOs & Community Projects",
      description: "Secure milestone-based funding with built-in accountability and transparent reporting.",
      benefits: [
        "Automated fund release upon milestone verification",
        "Build trust with transparent on-chain records",
        "Access to global impact investor network"
      ],
      cta: "Start Your Project"
    },
    {
      icon: TrendingUp,
      title: "For Impact Investors",
      description: "Track measurable ROI with complete visibility into fund usage and project outcomes.",
      benefits: [
        "Verifiable proof of impact through dynamic NFTs",
        "Real-time project progress monitoring",
        "Transparent fund flow and milestone tracking"
      ],
      cta: "Explore Investments"
    },
    {
      icon: Sparkles,
      title: "For Web3 Enthusiasts",
      description: "Participate in regenerative finance through meaningful, verifiable NFT contributions.",
      benefits: [
        "Evolving NFTs that showcase your impact journey",
        "Join a global community of change-makers",
        "Governance participation in project decisions"
      ],
      cta: "Get Started"
    }
  ];

  const router = useRouter();
  const [loadingIdx, setLoadingIdx] = useState(-1);

  const handleClick = (idx: number, href: string, e: any) => {
    e.preventDefault();
    setLoadingIdx(idx);
    router.push(href);
  };
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Everyone</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re creating impact, investing in change, or exploring Web3, TerraFund has you covered
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {segments.map((segment, index) => (
            <Card
              key={index}
              className="p-8 bg-card hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col"
            >
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6">
                <segment.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-semibold mb-3">{segment.title}</h3>
              <p className="text-muted-foreground mb-6">{segment.description}</p>

              <div className="space-y-3 mb-8 flex-grow">
                {segment.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full hover:border-primary/50 transition-colors"
                loading={loadingIdx === index}
                onClick={(e) => handleClick(index, segment.cta === "Start Your Project" ? "/create" : "/account", e)}
              >
                {segment.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetUsers;
