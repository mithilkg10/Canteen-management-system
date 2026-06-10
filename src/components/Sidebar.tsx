"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LayoutDashboard, Package, Clock, LogOut, ShieldAlert, Users, Truck, ShoppingCart, Briefcase } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null; // Don't show sidebar on login page

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["ADMIN", "MANAGER", "STAFF"] },
    { name: "Daily Orders", icon: ShoppingCart, path: "/orders", roles: ["ADMIN", "MANAGER", "STAFF"] },
    { name: "Procurements", icon: Truck, path: "/procurements", roles: ["ADMIN", "MANAGER"] },
    { name: "Inventory", icon: Package, path: "/inventory", roles: ["ADMIN", "MANAGER"] },
    { name: "Vendors", icon: Users, path: "/vendors", roles: ["ADMIN", "MANAGER"] },
    { name: "Clients", icon: Briefcase, path: "/clients", roles: ["ADMIN", "MANAGER"] },
    { name: "Attendance", icon: Clock, path: "/attendance", roles: ["ADMIN", "MANAGER", "STAFF"] },
    { name: "Audit Logs", icon: ShieldAlert, path: "/audit-logs", roles: ["ADMIN"] },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="brand">
          <Image src="/logo.png" alt="JK Catering Logo" width={48} height={48} className="brand-logo" />
          <h2>JK CATERING</h2>
        </div>
        <span className="role-badge">{session?.user?.role}</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems
          .filter(item => item.roles.includes(session?.user?.role as string))
          .map(item => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`nav-item ${pathname.includes(item.path) ? "active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="btn btn-secondary w-full">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
