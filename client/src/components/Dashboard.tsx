import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Share2, Users, TrendingUp, History, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Project, Participation, User } from "@shared/schema";

interface DashboardProps {
  user: {
    id: string;
    walletAddress: string;
    starPoints: number;
    referralCode: string;
    referredBy?: string;
  };
  referrals: User[];
}

export default function Dashboard({ user, referrals }: DashboardProps) {
  const { toast } = useToast();

  const { data: myProjects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/users", user.id, "projects"],
    enabled: !!user.id,
  });

  const { data: myParticipationsData = [], isLoading: participationsLoading } = useQuery<
    Array<{ participation: Participation; project: Project | null }>
  >({
    queryKey: ["/api/users", user.id, "participations"],
    enabled: !!user.id,
  });

  const copyReferralCode = () => {
    const url = `${window.location.origin}?ref=${user.referralCode}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your points, projects, and referrals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg
                className="w-20 h-20"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dashStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#FFA366" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z"
                  fill="url(#dashStarGradient)"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">STAR Points Balance</p>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent" data-testid="text-points-balance">
                {user.starPoints.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold" data-testid="text-referral-count">
              {referrals.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-secondary rounded-lg font-mono text-sm truncate" data-testid="text-referral-code">
            {window.location.origin}?ref={user.referralCode}
          </div>
          <Button onClick={copyReferralCode} data-testid="button-copy-referral">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" data-testid="button-share-referral">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Earn 10% of your referrals' minted points and participation rewards
        </p>
      </Card>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects" data-testid="tab-projects">My Projects</TabsTrigger>
          <TabsTrigger value="participations" data-testid="tab-participations">Participations</TabsTrigger>
          <TabsTrigger value="referrals" data-testid="tab-referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {projectsLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </Card>
              ))}
            </>
          ) : myProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">You haven't launched any projects yet</p>
            </Card>
          ) : (
            myProjects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">${project.symbol}</p>
                  </div>
                  <Badge>{project.status}</Badge>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="participations" className="space-y-4">
          {participationsLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </Card>
              ))}
            </>
          ) : myParticipationsData.length === 0 ? (
            <Card className="p-12 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">You haven't participated in any projects yet</p>
            </Card>
          ) : (
            myParticipationsData.map(({ participation, project }, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{project?.name || "Unknown Project"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {participation.starPointsUsed.toLocaleString()} STAR points
                    </p>
                  </div>
                  <Badge variant="secondary">Participated</Badge>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          {referrals.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No referrals yet. Share your link to start earning!</p>
            </Card>
          ) : (
            referrals.map((referral, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold font-mono">
                      {referral.walletAddress.slice(0, 8)}...{referral.walletAddress.slice(-6)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {referral.starPoints} STAR points
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
