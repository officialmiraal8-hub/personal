import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Shield, 
  Users, 
  TrendingUp, 
  Lock, 
  Clock, 
  Globe, 
  Zap 
} from "lucide-react";
import heroVideo from "@assets/grok-video-0d636410-3a5e-4295-b09c-f4009ec17f56 (1)_1762712752468.mp4";

const features = [
  {
    icon: Rocket,
    title: "Token Creation & Launch",
    description: "Deploy custom tokens on Stellar with a few clicks. Launch your project with professional-grade smart contracts.",
  },
  {
    icon: Users,
    title: "Airdrop Mechanism",
    description: "Distribute tokens efficiently to your community with automated airdrop tools and batch processing.",
  },
  {
    icon: TrendingUp,
    title: "Points-Based System",
    description: "Earn STAR points through platform engagement. Convert XLM to points at 1:10 ratio.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description: "Grow your network and earn rewards. Incentivize community growth with referral bonuses.",
  },
  {
    icon: Lock,
    title: "Liquidity Locking",
    description: "Automated liquidity pool locking ensures project credibility and investor protection.",
  },
  {
    icon: Clock,
    title: "Vesting Schedules",
    description: "Implement customizable token vesting schedules with cliff periods and linear unlocking.",
  },
  {
    icon: Globe,
    title: "Stellar Blockchain",
    description: "Built on Stellar's fast, low-cost network with Soroban smart contract integration.",
  },
  {
    icon: Shield,
    title: "Smart Contract Security",
    description: "Audited Soroban contracts ensure your funds and tokens are protected at all times.",
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            data-testid="video-hero-background"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 inline-block"
          >
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
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient"
          >
            STAR
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-4 font-light"
          >
            Premium DeFi Platform on Stellar
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Create tokens, manage airdrops, and launch on DEX with automated liquidity locking.
            Built with Soroban smart contracts on Stellar testnet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="px-12 py-6 text-lg font-semibold bg-primary transition-all duration-300 shadow-lg shadow-primary/50 hover:shadow-primary/70"
              onClick={() => setLocation("/app")}
              data-testid="button-launch-app"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Launch App
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">100M+</div>
              <div className="text-gray-400">Total Supply STR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">80%</div>
              <div className="text-gray-400">To Point Holders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">1:10</div>
              <div className="text-gray-400">XLM to STAR Points</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
              Platform Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to launch and manage your DeFi project on Stellar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="p-6 h-full bg-black/40 backdrop-blur-xl border-primary/20 hover-elevate"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="mb-4 inline-block p-3 rounded-md bg-primary/10">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-gradient-to-b from-black to-black/80">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">
              Ready to Launch Your Project?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join the next generation of DeFi on Stellar. Start building today with STAR.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="px-12 py-6 text-lg font-semibold border-primary/50 bg-primary/5 backdrop-blur-sm text-gray-100"
              onClick={() => setLocation("/app")}
              data-testid="button-get-started"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 107, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
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
