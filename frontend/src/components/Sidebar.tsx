"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <>
      {/* Botón hamburguesa}*/}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-900 dark:text-white border rounded-xl p-2 shadow"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay oscuro */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-30"
        />
      )}

      <aside
        className={`
          fixed md:sticky md:top-0
          top-0 left-0
          h-screen w-64
          border-r p-6
          flex flex-col justify-between
          bg-white dark:bg-gray-900 dark:text-white z-40
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          <h2 className="text-2xl font-bold mb-10">
            FreelanceFlow
          </h2>

          <nav className="flex flex-col gap-4">

            <Link
              href="/"
              className={`hover:text-blue-500 ${pathname === "/" ? "text-blue-500 font-bold" : ""}`}
            >
              Dashboard
            </Link>

            <Link
              href="/clients"
              className={`hover:text-blue-500 ${pathname === "/clients" ? "text-blue-500 font-bold" : ""}`}
            >
              Clients
            </Link>

            <Link
              href="/projects"
              className={`hover:text-blue-500 ${pathname === "/projects" ? "text-blue-500 font-bold" : ""}`}
            >
              Projects
            </Link>

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </aside>
    </>
  );
}