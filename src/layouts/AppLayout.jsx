import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  const location = useLocation();

  const hideHeaderRoutes = ["/search", "/compte"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background-dark overflow-x-hidden flex flex-col">
      {shouldShowHeader && <Header />}

      <main className={`flex-1 ${shouldShowHeader ? "pt-20 md:pt-24" : ""}`}>
        <Suspense fallback={<div className="p-6 text-center">Chargement...</div>}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
