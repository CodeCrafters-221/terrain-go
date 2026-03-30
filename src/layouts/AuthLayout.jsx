import { ArrowLeftCircle } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-background-dark backdrop-blur-sm relative">
      <Link to={"/"}>
        <ArrowLeftCircle className="size-8 text-primary absolute top-5 left-5 hover:opacity-20" />
      </Link>
      <Outlet />
    </div>
  )
}