'use client'
import { Twitter, Github, MessageCircle, Linkedin } from "lucide-react";

const Footer = () => {
  const links = {
    product: [
      { name: "Home", href: "#" },
      { name: "Projects", href: "#" },
      { name: "How It Works", href: "#" },
      { name: "Features", href: "#" }
    ],
    resources: [
      { name: "Whitepaper", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Blog", href: "#" },
      { name: "FAQ", href: "#" }
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/001Subodh", label: "Twitter" },
    
  ];

  return (
    <footer className="bg-charcoal text-white pt-16 pb-8">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              TerraFund
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transforming real-world community projects into verifiable, tokenized assets on Solana.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary/20 hover:scale-110 transition-all duration-300 border border-white/10 hover:border-secondary/50"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              {links.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              {links.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 TerraFund. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Powered by Solana. Built for a regenerative future.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
