import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Coins, Droplet, TrendingUp, Users } from "lucide-react";
import { type Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onParticipate: (projectId: string) => void;
}

export default function ProjectCard({ project, onParticipate }: ProjectCardProps) {
  const daysRemaining = Math.ceil(
    (new Date(project.endsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return (
    <Card className="p-6 hover-elevate transition-all duration-300 border-card-border" data-testid={`card-project-${project.id}`}>
      <div className="flex items-start gap-4 mb-4">
        {project.logoUrl ? (
          <img 
            src={project.logoUrl} 
            alt={project.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {project.symbol.charAt(0)}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold mb-1 truncate" data-testid={`text-project-name-${project.id}`}>
            {project.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" data-testid={`badge-symbol-${project.id}`}>
              ${project.symbol}
            </Badge>
            <Badge 
              variant={daysRemaining > 0 ? "default" : "secondary"}
              data-testid={`badge-status-${project.id}`}
            >
              {daysRemaining > 0 ? `${daysRemaining}d left` : "Ended"}
            </Badge>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {project.description}
      </p>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Supply</div>
            <div className="font-medium">{Number(project.totalSupply).toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Liquidity</div>
            <div className="font-medium">{project.minimumLiquidity} XLM</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Airdrop</div>
            <div className="font-medium">{project.airdropPercent}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Creator</div>
            <div className="font-medium">{project.creatorPercent}%</div>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        onClick={() => onParticipate(project.id)}
        disabled={daysRemaining <= 0}
        data-testid={`button-participate-${project.id}`}
      >
        Participate with STAR Points
      </Button>
    </Card>
  );
}
