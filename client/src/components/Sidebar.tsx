import { Button } from "@/components/ui/button";
import { Rocket, Coins, Globe, LayoutDashboard, BookOpen, Users, X } from "lucide-react";
import { FaTwitter, FaTelegram, FaDiscord } from "react-icons/fa";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: "launch", label: "Launch", icon: Rocket },
    { id: "mint", label: "Mint Points", icon: Coins },
    { id: "global", label: "Global", icon: Globe },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "docs", label: "Documentation", icon: BookOpen },
    { id: "join", label: "Join Us", icon: Users },
  ];
  
  const socialLinks = [
    { icon: FaTwitter, url: "https://twitter.com", label: "Twitter" },
    { icon: FaTelegram, url: "https://t.me", label: "Telegram" },
    { icon: FaDiscord, url: "https://discord.com", label: "Discord" },
  ];
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="sidebarStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#FFA366" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z"
                  fill="url(#sidebarStarGradient)"
                />
              </svg>
              <span className="text-xl font-bold">STAR</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
              data-testid="button-close-sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                data-testid={`button-sidebar-${item.id}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-3">Follow Us</p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(social.url, '_blank')}
                  data-testid={`button-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
