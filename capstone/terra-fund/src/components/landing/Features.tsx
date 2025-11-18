'use client'
import { Lock, Image, Eye, Users, Zap, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Lock,
      title: "Milestone Escrow Contracts",
      description: "Automated fund release tied to verified project milestones",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Image,
      title: "Dynamic Proof-of-Impact NFTs",
      description: "Evolving digital badges that showcase your contribution journey",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Eye,
      title: "Transparent Fund Flow",
      description: "Complete on-chain visibility of every transaction and milestone",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Users,
      title: "DAO-Based Governance",
      description: "Community-driven decision making for project validation",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Zap,
      title: "ReFi x Solana Integration",
      description: "Lightning-fast transactions with minimal environmental impact",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Globe,
      title: "Global Community Network",
      description: "Connect with impact projects and investors worldwide",
      color: "from-violet-500 to-purple-600"
    }
  ];

  return (
    <section className="py-24 md:py-36 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Powered by Solana
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Core Features
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Built on Solana for speed, security, and sustainability
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative p-8 border border-slate-800 hover:border-slate-700 transition-all duration-500 group hover:-translate-y-2 bg-slate-900/50 backdrop-blur-sm overflow-hidden"
            >
              {/* Gradient glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;