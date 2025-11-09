import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, Flame } from "lucide-react";

interface MintPointsProps {
  currentPoints: number;
  onMint: (xlmAmount: number) => void;
}

export default function MintPoints({ currentPoints, onMint }: MintPointsProps) {
  const [xlmAmount, setXlmAmount] = useState("");
  const starPoints = xlmAmount ? parseFloat(xlmAmount) * 10 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Mint STAR Points</h2>
        <p className="text-muted-foreground">
          Convert XLM to STAR points at a 1:10 ratio
        </p>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
        <Card className="relative p-8 bg-card/50 backdrop-blur">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full"></div>
              <svg
                className="w-32 h-32 relative animate-spin-slow"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="mintStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="50%" stopColor="#FF8533" />
                    <stop offset="100%" stopColor="#FFA366" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z"
                  fill="url(#mintStarGradient)"
                  filter="url(#glow)"
                  stroke="#FFA366"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              {currentPoints.toLocaleString()}
            </div>
            <p className="text-muted-foreground mt-1">Your STAR Points Balance</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="xlm-amount">Enter XLM Amount</Label>
              <Input
                id="xlm-amount"
                type="number"
                placeholder="100"
                value={xlmAmount}
                onChange={(e) => setXlmAmount(e.target.value)}
                className="text-lg"
                data-testid="input-xlm-amount"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <span className="text-muted-foreground">{xlmAmount || "0"} XLM</span>
              <span className="text-primary">=</span>
              <span className="text-primary">{starPoints.toLocaleString()} STAR</span>
            </div>

            <Button
              className="w-full py-6 text-lg"
              onClick={() => {
                if (xlmAmount) {
                  onMint(parseFloat(xlmAmount));
                  setXlmAmount("");
                }
              }}
              disabled={!xlmAmount || parseFloat(xlmAmount) <= 0}
              data-testid="button-mint"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Mint STAR Points
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Participate in Projects</h3>
              <p className="text-sm text-muted-foreground">
                Use STAR points to participate in token launches. 50% goes to creator, 50% burned.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Referral Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn 10% of your referrals' minted points and participation rewards.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
