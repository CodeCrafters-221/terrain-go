import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <Outlet />
    </div>
  )
}