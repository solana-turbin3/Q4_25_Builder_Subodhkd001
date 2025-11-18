'use client'
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CTA = () => {
  const router = useRouter();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleExplore = (e: any) => {
    e.preventDefault();
    setLoading1(true);
    router.push("/account");
  };
  const handleFunded = (e: any) => {
    e.preventDefault();
    setLoading2(true);
    router.push("/create");
  };
  return (
    <section className="py-20 md:py-32 gradient-organic text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold">
            Be Part of the{" "}
            <span className="text-secondary">Regenerative Future</span>
          </h2>

          <p className="text-xl text-white/90">
            Empower real-world impact with on-chain accountability. Join thousands of change-makers building a transparent, sustainable future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="group text-base" loading={loading1} onClick={handleExplore}>
              Explore Projects
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 text-base backdrop-blur-sm"
              loading={loading2}
              onClick={handleFunded}>
              Get Funded
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span>Built on Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Secure Smart Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>100% Transparent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
