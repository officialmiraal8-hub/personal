import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectWizard from "@/components/CreateProjectWizard";
import MintPoints from "@/components/MintPoints";
import GlobalStats from "@/components/GlobalStats";
import Dashboard from "@/components/Dashboard";
import Documentation from "@/components/Documentation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FaTwitter, FaTelegram, FaDiscord } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export default function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("launch");
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const { toast } = useToast();

  const mockUser = {
    walletAddress: walletAddress || "",
    starPoints: 15420,
    referralCode: "STAR123ABC",
  };

  const mockProjects = [
    {
      id: "1",
      creatorId: "creator1",
      name: "Luna Token",
      symbol: "LUNA",
      description: "A revolutionary DeFi token bringing liquidity to the Stellar ecosystem with innovative staking mechanisms.",
      logoUrl: "",
      totalSupply: "1000000000",
      decimals: 7,
      airdropPercent: 40,
      creatorPercent: 30,
      liquidityPercent: 30,
      minimumLiquidity: "500",
      hasVesting: true,
      vestingPeriodDays: 180,
      participationPeriodDays: 7,
      twitterUrl: "",
      telegramUrl: "",
      websiteUrl: "",
      contractAddress: "",
      status: "active",
      createdAt: new Date(),
      endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      creatorId: "creator2",
      name: "Solar Network",
      symbol: "SOLR",
      description: "Decentralized energy trading platform powered by Stellar smart contracts for sustainable future.",
      logoUrl: "",
      totalSupply: "500000000",
      decimals: 7,
      airdropPercent: 50,
      creatorPercent: 25,
      liquidityPercent: 25,
      minimumLiquidity: "1000",
      hasVesting: false,
      vestingPeriodDays: null,
      participationPeriodDays: 10,
      twitterUrl: "",
      telegramUrl: "",
      websiteUrl: "",
      contractAddress: "",
      status: "active",
      createdAt: new Date(),
      endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      creatorId: "creator3",
      name: "Quantum Finance",
      symbol: "QFIN",
      description: "Next-generation algorithmic trading protocol with AI-powered market making on Stellar.",
      logoUrl: "",
      totalSupply: "2000000000",
      decimals: 7,
      airdropPercent: 45,
      creatorPercent: 35,
      liquidityPercent: 20,
      minimumLiquidity: "750",
      hasVesting: true,
      vestingPeriodDays: 365,
      participationPeriodDays: 12,
      twitterUrl: "",
      telegramUrl: "",
      websiteUrl: "",
      contractAddress: "",
      status: "active",
      createdAt: new Date(),
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  ];

  const handleConnectWallet = () => {
    setWalletAddress("GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to Stellar network",
    });
  };

  const handleCreateProject = (data: any) => {
    console.log("Creating project:", data);
    setShowCreateWizard(false);
    toast({
      title: "Project Created!",
      description: "Your token has been deployed to Stellar testnet",
    });
  };

  const handleParticipate = (projectId: string) => {
    console.log("Participating in project:", projectId);
    toast({
      title: "Participation Successful",
      description: "You've joined the project with STAR points",
    });
  };

  const handleMint = (xlmAmount: number) => {
    console.log("Minting", xlmAmount * 10, "STAR points");
    toast({
      title: "STAR Points Minted",
      description: `Successfully minted ${xlmAmount * 10} STAR points`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
      />

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="container mx-auto px-6 py-8 pb-24 lg:pb-8">
        {activeTab === "launch" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Token Launches</h2>
                <p className="text-muted-foreground">
                  Participate in active token launches with STAR points
                </p>
              </div>
              <Button
                onClick={() => setShowCreateWizard(true)}
                data-testid="button-create-project"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onParticipate={handleParticipate}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "mint" && (
          <MintPoints currentPoints={mockUser.starPoints} onMint={handleMint} />
        )}

        {activeTab === "global" && (
          <GlobalStats
            totalUsers={12548}
            dailyActiveUsers={3421}
            activeProjects={mockProjects.length}
            totalPointsMinted={1245000}
          />
        )}

        {activeTab === "dashboard" && (
          <Dashboard
            user={mockUser}
            myProjects={[]}
            myParticipations={[]}
            referrals={[
              { walletAddress: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", starPoints: 2500 },
              { walletAddress: "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", starPoints: 1200 },
            ]}
          />
        )}

        {activeTab === "docs" && <Documentation />}

        {activeTab === "join" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Join Our Community</h2>
              <p className="text-muted-foreground">
                Connect with us on social media and stay updated
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Button
                variant="outline"
                className="h-32 flex-col gap-4 hover-elevate"
                onClick={() => window.open("https://twitter.com", "_blank")}
                data-testid="button-join-twitter"
              >
                <FaTwitter className="h-12 w-12 text-primary" />
                <span className="text-lg font-semibold">Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="h-32 flex-col gap-4 hover-elevate"
                onClick={() => window.open("https://t.me", "_blank")}
                data-testid="button-join-telegram"
              >
                <FaTelegram className="h-12 w-12 text-primary" />
                <span className="text-lg font-semibold">Telegram</span>
              </Button>

              <Button
                variant="outline"
                className="h-32 flex-col gap-4 hover-elevate"
                onClick={() => window.open("https://discord.com", "_blank")}
                data-testid="button-join-discord"
              >
                <FaDiscord className="h-12 w-12 text-primary" />
                <span className="text-lg font-semibold">Discord</span>
              </Button>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {showCreateWizard && (
        <CreateProjectWizard
          onClose={() => setShowCreateWizard(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
}
