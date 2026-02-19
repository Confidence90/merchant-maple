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
import UsersManagement from "./pages/admin/UsersManagement";
import Settings from "./pages/vendor/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/vendor/AddProduct";
import AdminRoute from "./components/AdminRoute";
import Index from "./pages/Index";
import VendorSetup from "./pages/VendorSetup";
import Notifications from "./pages/vendor/Notifications";
import VerifyEmail from "./components/VerifyEmail";
import VendorRoute from "./components/auth/VendorRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/vendor-setup" element={<VendorSetup />} />
          <Route path="/dashboard" element={<VendorRoute><VendorLayout><Dashboard /></VendorLayout></VendorRoute>} />
          <Route path="/products" element={<VendorRoute><VendorLayout><Products /></VendorLayout></VendorRoute>} />
          <Route path="/orders" element={<VendorRoute><VendorLayout><Orders /></VendorLayout></VendorRoute>} />
          <Route path="/messages" element={<VendorRoute><VendorLayout><Messages /></VendorLayout></VendorRoute>} />
          <Route path="/wallet" element={<VendorRoute><VendorLayout><Wallet /></VendorLayout></VendorRoute>} />
          <Route path="/profile" element={<VendorRoute><VendorLayout><Profile /></VendorLayout></VendorRoute>} />
          <Route path="/reviews" element={<VendorRoute><VendorLayout><Reviews /></VendorLayout></VendorRoute>} />
          <Route path="/marketing" element={<VendorRoute><VendorLayout><Marketing /></VendorLayout></VendorRoute>} />
          <Route path="/products/add" element={<VendorRoute><VendorLayout><AddProduct /></VendorLayout></VendorRoute>} />
          <Route path="/statistics" element={<VendorRoute><VendorLayout><Statistics /></VendorLayout></VendorRoute>} />
          <Route path="/settings" element={<VendorRoute><VendorLayout><Settings /></VendorLayout></VendorRoute>} />
          <Route path="/admin/users" element={<VendorRoute><VendorLayout><UsersManagement /></VendorLayout></VendorRoute>} />
          <Route path="/notifications" element={<VendorRoute><VendorLayout><Notifications /></VendorLayout></VendorRoute>} />
          <Route path="*" element={<NotFound />} />
          
          <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <UsersManagement />
            </AdminRoute>
          } 
        />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
