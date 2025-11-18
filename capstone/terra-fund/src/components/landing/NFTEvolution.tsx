'use client'
import Image from "next/image";

const NFTEvolution = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background to-primary/5">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10">
              <Image 
                src="/nft-evolution.jpg" 
                height={300}
                width={300}
                alt="Dynamic NFT evolution stages showing progressive impact verification" 
                className="rounded-2xl shadow-2xl w-full animate-float"
              />
            </div>
            {/* Decorative glow */}
            <div className="absolute inset-0 gradient-solana rounded-2xl blur-3xl opacity-20 animate-pulse"></div>
          </div>
          
          {/* Right: Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm">
              <span className="text-sm font-medium text-secondary">Impact Visualization</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold">
              Your Contribution,{" "}
              <span className="bg-gradient-to-r from-solana-purple to-solana-cyan bg-clip-text text-transparent">
                Visibly Rewarded
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Watch your impact grow through dynamic NFTs that evolve as project milestones are achieved. Each stage represents verified progress, creating a transparent record of your contribution to real-world change.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Initial Contribution</h4>
                  <p className="text-sm text-muted-foreground">Receive your first NFT badge when you support a project</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-secondary font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Milestone Progress</h4>
                  <p className="text-sm text-muted-foreground">Your NFT evolves as project milestones are verified on-chain</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full gradient-solana flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Full Impact Proof</h4>
                  <p className="text-sm text-muted-foreground">Final NFT showcases complete project success and your role in it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTEvolution;
