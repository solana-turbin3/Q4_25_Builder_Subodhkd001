'use client'
import { Rocket, Shield, Award } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Rocket,
      title: "Create / Support a Project",
      description: "NGOs or communities onboard their initiative with clear milestones and funding goals."
    },
    {
      number: "02",
      icon: Shield,
      title: "Smart Escrow Funding",
      description: "Funds are locked in milestone-based smart contracts, ensuring accountability and proper use."
    },
    {
      number: "03",
      icon: Award,
      title: "Proof-of-Impact NFTs",
      description: "Contributors receive NFTs that evolve with project progress, showcasing their verified impact."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-10">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">How It Works</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Three simple steps to transparent, verifiable impact funding
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 group">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/50 group-hover:scale-110 group-hover:shadow-emerald-500/70 transition-all">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="mt-8 mb-6 w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                    <step.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                
                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <div className="w-0.5 h-12 bg-gradient-to-b from-emerald-500/50 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;