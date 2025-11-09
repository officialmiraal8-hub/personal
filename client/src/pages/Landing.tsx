import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-5xl">
          <div className="mb-8 inline-block">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full"></div>
              <svg
                className="w-32 h-32 md:w-40 md:h-40 relative animate-pulse"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="50%" stopColor="#FF8533" />
                    <stop offset="100%" stopColor="#FFA366" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z"
                  fill="url(#starGradient)"
                  stroke="#FFA366"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient">
            STAR
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            Premium DeFi Platform on Stellar
          </p>
          
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Create tokens, manage airdrops, and launch on DEX with automated liquidity locking. 
            Built with Soroban smart contracts on Stellar testnet.
          </p>
          
          <Button
            size="lg"
            className="px-12 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/50 hover:shadow-primary/70 hover:scale-105"
            onClick={() => setLocation("/app")}
            data-testid="button-launch-app"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Launch App
          </Button>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-sm text-gray-500">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">100M+</div>
            <div>Total Supply STR</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">80%</div>
            <div>To Point Holders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1:10</div>
            <div>XLM to STAR Points</div>
          </div>
        </div>
      </div>
      
      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 107, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
