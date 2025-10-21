import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Wallet,
  User,
  Star,
  Megaphone,
  BarChart3,
  Settings,
  Store,
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Produits", url: "/products", icon: Package },
  { title: "Commandes", url: "/orders", icon: ShoppingCart },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Portefeuille", url: "/wallet", icon: Wallet },
  { title: "Profil boutique", url: "/profile", icon: User },
  { title: "Avis clients", url: "/reviews", icon: Star },
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
        <div className="flex items-center gap-2 px-4 py-6">
          <Store className="h-8 w-8 text-sidebar-primary" />
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">Ma Boutique</h2>
              <p className="text-xs text-sidebar-foreground/60">Espace vendeur</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 ${
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
