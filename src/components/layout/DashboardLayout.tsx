import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 md:block">
          <Sidebar />
        </aside>
        <main className="flex-1">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="container py-6 md:py-8">{children}</div>
          </ScrollArea>
        </main>
      </div>
      <Footer />
    </div>
  );
}
