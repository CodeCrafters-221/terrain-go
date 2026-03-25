import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  const location = useLocation();

  const hideHeaderRoutes = ["/search", "/compte"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
<<<<<<< HEAD
    <>
      <Header />
      <main>
=======
    <div className="min-h-screen bg-background-dark overflow-x-hidden flex flex-col">
      {shouldShowHeader && <Header />}

      <main className={`flex-1 ${shouldShowHeader ? "pt-20 md:pt-24" : ""}`}>
>>>>>>> c1eb517d823af4dfa0650358f8eaa659c67727b4
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
