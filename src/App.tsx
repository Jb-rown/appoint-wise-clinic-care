
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6">
                    <Dashboard />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          } />
          <Route path="/patients" element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6">
                    <Patients />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          } />
          <Route path="/appointments" element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6">
                    <Appointments />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          } />
          <Route path="/reminders" element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6">
                    <Reminders />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          } />
          <Route path="/settings" element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6">
                    <Settings />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
