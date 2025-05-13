import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Home,
  Users,
  Settings,
  AlertCircle,
  Wrench,
  ClipboardList,
  FileText,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/types/auth";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

const SidebarItem = ({ href, icon, title, isActive }: SidebarItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground",
    )}
  >
    {icon}
    <span>{title}</span>
  </Link>
);

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!user) {
    return null;
  }

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Define routes based on user role
  const routes = [
    {
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      title: "Dashboard",
      roles: ["user", "technician", "admin"],
    },
    {
      href: "/machines",
      icon: <Settings className="h-5 w-5" />,
      title: "Machines",
      roles: ["technician", "admin"],
    },
    {
      href: "/alerts",
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Alerts",
      roles: ["user", "technician", "admin"],
    },
    {
      href: "/maintenance",
      icon: <Wrench className="h-5 w-5" />,
      title: "Maintenance",
      roles: ["technician", "admin"],
    },
    {
      href: "/users",
      icon: <Users className="h-5 w-5" />,
      title: "Users",
      roles: ["admin"],
    },
    {
      href: "/reports",
      icon: <FileText className="h-5 w-5" />,
      title: "Reports",
      roles: ["admin"],
    },
    {
      href: "/prediction",
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Prediction",
      roles: ["technician", "admin"],
    },
    {
      href: "/feedback",
      icon: <ClipboardList className="h-5 w-5" />,
      title: "Feedback",
      roles: ["user", "admin"],
    },
    {
      href: "/notifications",
      icon: <Bell className="h-5 w-5" />,
      title: "Notifications",
      roles: ["user", "technician", "admin"],
    },
  ];

  // Filter routes based on user role
  const filteredRoutes = routes.filter((route) => {
    return route.roles.includes(user.role as UserRole);
  });

  return (
    <div className="flex h-full w-full flex-col border-r bg-sidebar-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded bg-indigo-600 p-1">
            <div className="h-5 w-5 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                <path d="M12 12v5" />
                <path d="M8 12v5" />
                <path d="M16 12v5" />
              </svg>
            </div>
          </div>
          <span className="font-semibold">MIC Service Laser</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-1">
          {filteredRoutes.map((route) => (
            <SidebarItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              title={route.title}
              isActive={isActive(route.href)}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 mt-auto border-t bg-sidebar-background p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}
