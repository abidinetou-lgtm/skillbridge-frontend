import type { ReactNode } from "react";

import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";

export function AppShell({
  children,
  footer = true,
}: {
  children: ReactNode;
  footer?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      {footer && <Footer />}
      <div className="pb-16 lg:hidden" />
      <BottomNav />
    </div>
  );
}
