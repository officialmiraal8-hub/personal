import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { buildCreateProjectTransaction, submitTransaction } from "@/lib/sorobanClient";
import { freighterWallet } from "@/lib/walletConnect";
import { getExplorerUrl } from "@/config/contracts";

interface ProjectFormData {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  description: string;
  twitterUrl: string;
  telegramUrl: string;
  websiteUrl: string;
  airdropPercent: number;
  creatorPercent: number;
  liquidityPercent: number;
  minimumLiquidity: string;
  hasVesting: boolean;
  vestingPeriodDays: number;
  participationPeriodDays: number;
}

interface CreateProjectWizardProps {
  onClose: () => void;
  walletAddress?: string;
  currentUserId?: string;
}

export default function CreateProjectWizard({ onClose, walletAddress, currentUserId }: CreateProjectWizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: 7,
    description: "",
    twitterUrl: "",
    telegramUrl: "",
    websiteUrl: "",
    airdropPercent: 40,
    creatorPercent: 30,
    liquidityPercent: 30,
    minimumLiquidity: "500",
    hasVesting: false,
    vestingPeriodDays: 180,
    participationPeriodDays: 7,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData & { walletAddress: string }) => {
      // Step 1: Build Soroban transaction
      const network = await freighterWallet.getFreighterNetwork();
      
      // For now, use placeholder token address - in production, this would be created first
      const placeholderTokenAddress = "GBGTK4RQSA3XRJLOW7MX3FJBFPXZVFZLZXUK2WVQXG3DFI5NBVSAMPLE";
      
      const unsignedXDR = await buildCreateProjectTransaction(
        data.walletAddress,
        {
          name: data.name,
          symbol: data.symbol,
          tokenAddress: placeholderTokenAddress,
          totalSupply: data.totalSupply,
          airdropPercent: data.airdropPercent,
          creatorPercent: data.creatorPercent,
          liquidityPercent: data.liquidityPercent,
          minimumLiquidity: data.minimumLiquidity,
          participationPeriodDays: data.participationPeriodDays,
          hasVesting: data.hasVesting,
          vestingPeriodDays: data.vestingPeriodDays,
        },
        network
      );
      
      // Step 2: Sign with Freighter wallet
      const signedXDR = await freighterWallet.signTransaction(unsignedXDR);
      
      // Step 3: Submit to Stellar network
      const { hash } = await submitTransaction(signedXDR);
      
      // Step 4: Update local database with on-chain data
      const res = await apiRequest("POST", "/api/projects/create", {
        ...data,
        txHash: hash,
      });
      const result = await res.json();
      
      return { ...result, txHash: hash, network };
    },
    onSuccess: (data: { name: string; txHash: string; network: 'testnet' | 'mainnet' }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "projects"] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/stats/global"] });
      
      const explorerUrl = getExplorerUrl(data.network, 'tx', data.txHash);
      
      toast({
        title: "Project Created!",
        description: (
          <div className="space-y-2">
            <p>{data.name} has been deployed to Stellar blockchain!</p>
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
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error?.details?.[0]?.message || error?.error || error?.message || "Failed to create project";
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePercentChange = (field: 'airdropPercent' | 'creatorPercent' | 'liquidityPercent', value: number) => {
    const newData = { ...formData, [field]: value };
    const total = newData.airdropPercent + newData.creatorPercent + newData.liquidityPercent;
    if (total <= 100) {
      setFormData(newData);
    }
  };

  const handleSubmit = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate({
      ...formData,
      walletAddress,
    });
  };

  const totalPercent = formData.airdropPercent + formData.creatorPercent + formData.liquidityPercent;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Create New Token</h2>
          <p className="text-muted-foreground">Deploy your token on Stellar in 3 easy steps</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step > s ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Token Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Stellar Token"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  data-testid="input-token-name"
                />
              </div>
              <div>
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., STR"
                  value={formData.symbol}
                  onChange={(e) => updateField("symbol", e.target.value.toUpperCase())}
                  data-testid="input-token-symbol"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supply">Total Supply *</Label>
                <Input
                  id="supply"
                  type="number"
                  placeholder="1000000"
                  value={formData.totalSupply}
                  onChange={(e) => updateField("totalSupply", e.target.value)}
                  data-testid="input-total-supply"
                />
              </div>
              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  type="number"
                  value={formData.decimals}
                  onChange={(e) => updateField("decimals", parseInt(e.target.value))}
                  data-testid="input-decimals"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your token project..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                data-testid="input-description"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="twitter">Twitter (Optional)</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/..."
                  value={formData.twitterUrl}
                  onChange={(e) => updateField("twitterUrl", e.target.value)}
                  data-testid="input-twitter"
                />
              </div>
              <div>
                <Label htmlFor="telegram">Telegram (Optional)</Label>
                <Input
                  id="telegram"
                  placeholder="https://t.me/..."
                  value={formData.telegramUrl}
                  onChange={(e) => updateField("telegramUrl", e.target.value)}
                  data-testid="input-telegram"
                />
              </div>
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  placeholder="https://..."
                  value={formData.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                  data-testid="input-website"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Airdrop Supply</Label>
                <Badge variant="secondary">{formData.airdropPercent}%</Badge>
              </div>
              <Slider
                value={[formData.airdropPercent]}
                onValueChange={([value]) => handlePercentChange("airdropPercent", value)}
                max={100}
                step={1}
                data-testid="slider-airdrop"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Creator Supply</Label>
                <Badge variant="secondary">{formData.creatorPercent}%</Badge>
              </div>
              <Slider
                value={[formData.creatorPercent]}
                onValueChange={([value]) => handlePercentChange("creatorPercent", value)}
                max={100}
                step={1}
                data-testid="slider-creator"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Liquidity Supply</Label>
                <Badge variant="secondary">{formData.liquidityPercent}%</Badge>
              </div>
              <Slider
                value={[formData.liquidityPercent]}
                onValueChange={([value]) => handlePercentChange("liquidityPercent", value)}
                max={100}
                step={1}
                data-testid="slider-liquidity"
              />
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Allocation</span>
                <Badge variant={totalPercent === 100 ? "default" : "destructive"}>
                  {totalPercent}%
                </Badge>
              </div>
              {totalPercent !== 100 && (
                <p className="text-xs text-destructive mt-2">
                  Total must equal 100%
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="minLiquidity">Minimum Liquidity (XLM) *</Label>
              <Input
                id="minLiquidity"
                type="number"
                placeholder="500"
                value={formData.minimumLiquidity}
                onChange={(e) => updateField("minimumLiquidity", e.target.value)}
                data-testid="input-min-liquidity"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 500 XLM required for liquidity lock
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <Label htmlFor="vesting">Enable Team Vesting</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Lock team tokens with vesting schedule
                </p>
              </div>
              <Switch
                id="vesting"
                checked={formData.hasVesting}
                onCheckedChange={(checked) => updateField("hasVesting", checked)}
                data-testid="switch-vesting"
              />
            </div>

            {formData.hasVesting && (
              <div>
                <Label>Vesting Period (Days)</Label>
                <Input
                  type="number"
                  value={formData.vestingPeriodDays}
                  onChange={(e) => updateField("vestingPeriodDays", parseInt(e.target.value))}
                  data-testid="input-vesting-days"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Participation Period</Label>
                <Badge variant="secondary">{formData.participationPeriodDays} days</Badge>
              </div>
              <Slider
                value={[formData.participationPeriodDays]}
                onValueChange={([value]) => updateField("participationPeriodDays", value)}
                min={3}
                max={15}
                step={1}
                data-testid="slider-participation"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 3 days, maximum 15 days
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            disabled={createProjectMutation.isPending}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
            disabled={(step === 2 && totalPercent !== 100) || createProjectMutation.isPending}
            data-testid="button-next"
          >
            {step === 3 ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {createProjectMutation.isPending ? "Creating..." : "Create Token"}
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
