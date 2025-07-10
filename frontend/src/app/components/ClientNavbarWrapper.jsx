"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientNavbarWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/AdminDashboard") || pathname.startsWith("/UserDashboard")) return null;
  return <Navbar />;
} 