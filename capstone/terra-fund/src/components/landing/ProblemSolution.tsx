'use client'
import { AlertCircle, ShieldAlert, EyeOff, CheckCircle2, Lock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

const ProblemSolution = () => {
  const problems = [
    {
      icon: AlertCircle,
      title: "Misused Funds",
      description: "Traditional funding lacks accountability, leading to misallocated resources."
    },
    {
      icon: EyeOff,
      title: "Zero Transparency",
      description: "Donors have no visibility into how their contributions are being used."
    },
    {
      icon: ShieldAlert,
      title: "No Impact Visibility",
      description: "It's impossible to track and verify the real-world impact of contributions."
    }
  ];

  const solutions = [
    {
      icon: Lock,
      title: "Milestone Escrow Contracts",
      description: "Funds are locked in smart contracts and released only when verified milestones are achieved."
    },
    {
      icon: CheckCircle2,
      title: "Dynamic NFT Rewards",
      description: "Contributors receive evolving NFTs that showcase their impact as projects progress."
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description: "Every transaction and milestone is recorded on-chain for complete visibility."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gray-950">
      <div className="container px-4 md:px-6">
        {/* Problem Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              The Problem: Broken Trust in{" "}
              <span className="text-red-400">Impact Funding</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Traditional funding mechanisms fail communities and donors alike
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {problems.map((problem, index) => (
              <Card 
                key={index} 
                className="p-6 bg-gray-900/50 backdrop-blur-sm border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10"
              >
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                  <problem.icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{problem.title}</h3>
                <p className="text-gray-400">{problem.description}</p>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Solution Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm mb-4">
              <span className="text-sm font-medium text-emerald-400">Our Solution</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Milestone-Based Smart Contracts +{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Dynamic NFTs
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Bringing accountability, transparency, and proof-of-impact to regenerative finance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {solutions.map((solution, index) => (
              <Card 
                key={index} 
                className="p-6 bg-gray-900/50 backdrop-blur-sm border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-105 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/50">
                  <solution.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{solution.title}</h3>
                <p className="text-gray-400">{solution.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;