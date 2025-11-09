import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Zap, ArrowRight, Gift, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { buildMintStarPointsTransaction, submitTransaction } from "@/lib/sorobanClient";
import { freighterWallet } from "@/lib/walletConnect";
import { getExplorerUrl } from "@/config/contracts";

interface MintPointsProps {
  currentPoints: number;
  walletAddress?: string;
  currentUserId?: string;
}

export default function MintPoints({ currentPoints, walletAddress, currentUserId }: MintPointsProps) {
  const [xlmAmount, setXlmAmount] = useState("");
  const starPoints = xlmAmount ? parseFloat(xlmAmount) * 10 : 0;
  const { toast } = useToast();

  const mintMutation = useMutation({
    mutationFn: async (data: { walletAddress: string; xlmAmount: number }) => {
      // Step 1: Build Soroban transaction
      const network = await freighterWallet.getFreighterNetwork();
      const unsignedXDR = await buildMintStarPointsTransaction(
        data.walletAddress,
        data.xlmAmount,
        network
      );
      
      // Step 2: Sign with Freighter wallet
      const signedXDR = await freighterWallet.signTransaction(unsignedXDR);
      
      // Step 3: Submit to Stellar network
      const { hash } = await submitTransaction(signedXDR);
      
      // Step 4: Update local database
      const res = await apiRequest("POST", "/api/points/mint", {
        ...data,
        txHash: hash,
      });
      const result = await res.json();
      
      return { ...result, txHash: hash, network };
    },
    onSuccess: (data: { user: User; transaction: { xlmAmount: number; starPointsMinted: number; referrerReward: number; referrerWallet: string | null }; txHash: string; network: 'testnet' | 'mainnet' }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/global"] });
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "projects"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "participations"] });
      }
      
      setXlmAmount("");
      
      const explorerUrl = getExplorerUrl(data.network, 'tx', data.txHash);
      
      toast({
        title: "STAR Points Minted!",
        description: (
          <div className="space-y-2">
            <p>Successfully minted {data.transaction.starPointsMinted.toLocaleString()} STAR points from {data.transaction.xlmAmount} XLM{data.transaction.referrerReward > 0 ? `. Your referrer earned ${data.transaction.referrerReward.toLocaleString()} bonus points!` : ""}</p>
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              View on Stellar Explorer <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
      });
    },
    onError: (error) => {
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Failed to mint STAR points. Check your wallet balance and network connection.",
        variant: "destructive",
      });
    },
  });

  const handleMint = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!xlmAmount || parseFloat(xlmAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid XLM amount",
        variant: "destructive",
      });
      return;
    }

    mintMutation.mutate({
      walletAddress,
      xlmAmount: parseFloat(xlmAmount),
    });
  };

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

            <div className="flex items-center justify-center gap-3 text-2xl font-semibold">
              <span className="text-muted-foreground">{xlmAmount || "0"} XLM</span>
              <ArrowRight className="h-6 w-6 text-primary" />
              <span className="text-primary">{starPoints.toLocaleString()} STAR</span>
            </div>

            <Button
              className="w-full py-6 text-lg"
              onClick={handleMint}
              disabled={!xlmAmount || parseFloat(xlmAmount) <= 0 || mintMutation.isPending}
              data-testid="button-mint"
            >
              <Zap className="mr-2 h-5 w-5" />
              {mintMutation.isPending ? "Minting..." : "Mint STAR Points"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-orange-400 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
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
            <div className="p-3 bg-gradient-to-br from-orange-400 to-primary rounded-lg">
              <Gift className="h-6 w-6 text-white" />
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
