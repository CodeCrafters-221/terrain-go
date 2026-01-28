
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  const location = useLocation();
  const hideHeaderRoutes = ["/search", "/profile"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

