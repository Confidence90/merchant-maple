import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VendorLayout } from "./components/layout/VendorLayout";
import Dashboard from "./pages/vendor/Dashboard";
import Products from "./pages/vendor/Products";
import Orders from "./pages/vendor/Orders";
import Messages from "./pages/vendor/Messages";
import Wallet from "./pages/vendor/Wallet";
import Profile from "./pages/vendor/Profile";
import Reviews from "./pages/vendor/Reviews";
import Marketing from "./pages/vendor/Marketing";
import Statistics from "./pages/vendor/Statistics";
import Settings from "./pages/vendor/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VendorLayout><Dashboard /></VendorLayout>} />
          <Route path="/products" element={<VendorLayout><Products /></VendorLayout>} />
          <Route path="/orders" element={<VendorLayout><Orders /></VendorLayout>} />
          <Route path="/messages" element={<VendorLayout><Messages /></VendorLayout>} />
          <Route path="/wallet" element={<VendorLayout><Wallet /></VendorLayout>} />
          <Route path="/profile" element={<VendorLayout><Profile /></VendorLayout>} />
          <Route path="/reviews" element={<VendorLayout><Reviews /></VendorLayout>} />
          <Route path="/marketing" element={<VendorLayout><Marketing /></VendorLayout>} />
          <Route path="/statistics" element={<VendorLayout><Statistics /></VendorLayout>} />
          <Route path="/settings" element={<VendorLayout><Settings /></VendorLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
