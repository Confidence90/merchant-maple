// src/components/layout/VendorSidebar.tsx (mettre à jour les menuItems)
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Wallet,
  User,
  Star, // Icône pour les avis
  Megaphone,
  BarChart3,
  Settings,
  Store,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Produits", url: "/products", icon: Package },
  { title: "Commandes", url: "/orders", icon: ShoppingCart },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Portefeuille", url: "/wallet", icon: Wallet },
  { title: "Profil boutique", url: "/profile", icon: User },
  { title: "Avis clients", url: "/reviews", icon: Star }, // Ajouté ici
  { title: "Marketing", url: "/marketing", icon: Megaphone },
  { title: "Statistiques", url: "/statistics", icon: BarChart3 },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function VendorSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo/Boutique cliquable */}
        <NavLink to="/vendor/dashboard" className="block">
          <div className="flex items-center gap-2 px-4 py-6 hover:bg-sidebar-accent/50 rounded-lg transition-colors cursor-pointer">
            <Store className="h-8 w-8 text-sidebar-primary" />
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-sidebar-foreground">Ma Boutique</h2>
                <p className="text-xs text-sidebar-foreground/60">Espace vendeur</p>
              </div>
            )}
          </div>
        </NavLink>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/vendor/dashboard"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}