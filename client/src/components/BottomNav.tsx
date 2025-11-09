import { Button } from "@/components/ui/button";
import { Rocket, Coins, Globe, LayoutDashboard, BookOpen, Users } from "lucide-react";
import { FaTwitter, FaTelegram, FaDiscord } from "react-icons/fa";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: "launch", label: "Launch", icon: Rocket },
    { id: "mint", label: "Mint Points", icon: Coins },
    { id: "global", label: "Global", icon: Globe },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "docs", label: "Documentation", icon: BookOpen },
    { id: "join", label: "Join Us", icon: Users },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur supports-[backdrop-filter]:bg-background/95 lg:hidden z-40">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.slice(0, 4).map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(item.id)}
            className="flex-col h-auto py-2 px-3"
            data-testid={`button-nav-${item.id}`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
