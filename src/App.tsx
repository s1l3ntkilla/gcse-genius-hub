import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import RevisionHub from "./pages/RevisionHub";
import Messages from "./pages/Messages";
import ClassroomQA from "./pages/ClassroomQA";
import Lessons from "./pages/Lessons";
import Assignments from "./pages/Assignments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/revision" element={<RevisionHub />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/qa" element={<ClassroomQA />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/classes" element={<Index />} />
            <Route path="/analytics" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
