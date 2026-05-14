import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Sparkles, FileText, MapPin, Shirt, Network, Library, Dna, Send, Settings as SettingsIcon, Users, LogOut } from "lucide-react";
import { useStudio } from "@/hooks/useStudio";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const groups = [
  { label: "Workspace", items: [
    { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/archive", label: "Archive", icon: Library },
    { to: "/app/dna", label: "Director DNA", icon: Dna },
    { to: "/app/distribution", label: "Distribution", icon: Send },
  ]},
  { label: "Agents", items: [
    { to: "/app/agents/nexus", label: "NEXUS", icon: Network },
    { to: "/app/agents/praxis", label: "PRAXIS", icon: Sparkles },
    { to: "/app/agents/scribe", label: "SCRIBE", icon: FileText },
    { to: "/app/agents/architect", label: "ARCHITECT", icon: MapPin },
    { to: "/app/agents/egos", label: "EGOS", icon: Shirt },
  ]},
  { label: "Platform", items: [
    { to: "/app/studios", label: "Studios", icon: Users },
    { to: "/app/settings", label: "Settings", icon: SettingsIcon },
  ]},
];

export default function AppLayout() {
  const { data: studio } = useStudio();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [hoursSaved, setHoursSaved] = useState(0);

  useEffect(() => {
    if (!studio) return;
    const since = new Date(); since.setDate(since.getDate() - 7);
    supabase.from("agent_runs").select("hours_saved").eq("studio_id", studio.id).gte("created_at", since.toISOString())
      .then(({ data }) => setHoursSaved((data || []).reduce((s, r: any) => s + Number(r.hours_saved || 0), 0)));
  }, [studio]);

  const theme = (studio as any)?.brand_theme || {};
  const accent = theme.accent || "45 56% 51%";
  const brandStyle = { ["--accent" as any]: `hsl(${accent})`, ["--gold" as any]: accent } as React.CSSProperties;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black text-white" style={brandStyle}>
        <Sidebar collapsible="icon" className="border-r border-white/10 [&>div]:bg-zinc-950">
          <SidebarContent className="bg-zinc-950">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              {theme.logo_url ? (
                <img src={theme.logo_url} alt={studio?.name} className="h-7 w-auto" />
              ) : (
                <div className="font-bagel text-lg tracking-wider">AGENTIC</div>
              )}
              <div>
                <div className="text-xs text-white/40">{studio?.name || "Studio"}</div>
                {(studio as any)?.tier === "premium" && (
                  <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: `hsl(${accent})` }}>Premium</div>
                )}
              </div>
            </div>
            {groups.map((g) => (
              <SidebarGroup key={g.label}>
                <SidebarGroupLabel className="text-white/40 text-[10px] tracking-[0.2em] uppercase">{g.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {g.items.map((it) => (
                      <SidebarMenuItem key={it.to}>
                        <SidebarMenuButton asChild>
                          <NavLink to={it.to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                            <it.icon className="w-4 h-4" />
                            <span>{it.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
            <div className="mt-auto p-3 border-t border-white/10">
              <button onClick={async () => { await signOut(); navigate("/"); }} className="w-full flex items-center gap-2 text-white/60 hover:text-white text-sm px-2 py-2"><LogOut className="w-4 h-4" /> Sign out</button>
            </div>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b border-white/10 px-4 bg-zinc-950/80 backdrop-blur">
            <SidebarTrigger className="text-white/70" />
            <div className="flex-1" />
            <div className="text-xs text-white/50">Day Back this week</div>
            <div className="font-bagel text-xl text-accent-emerald">{hoursSaved.toFixed(1)}h</div>
          </header>
          <main className="flex-1 overflow-auto"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
