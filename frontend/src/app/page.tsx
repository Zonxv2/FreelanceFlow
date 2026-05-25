"use client";

import { useEffect, useState } from "react";
import api from "../app/services/api";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

export default function Home() {

  const [clientsCount, setClientsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const router = useRouter();

  // FIX: redirige si no hay token, igual que clients y projects
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [clientsResponse, projectsResponse] = await Promise.all([
          api.get("/clients"),
          api.get("/projects"),
        ]);

        setClientsCount(clientsResponse.data.length);
        setProjectsCount(projectsResponse.data.length);

        const totalRevenue = projectsResponse.data.reduce(
          (acc: number, project: any) => acc + project.budget,
          0
        );

        setRevenue(totalRevenue);

      } catch (error) {
        router.push("/login");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8 pt-16 md:pt-8 text-sm md:text-base">

        <h1 className="text-4xl font-bold mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div
            className="
              border
              rounded-3xl
              p-7
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition
              bg-white
              transform
              duration-300
            "
          >
            <h2 className="text-gray-500 mb-2">
              👥 Total Clients
            </h2>

            <p className="text-3xl font-bold text-black">
              {clientsCount}
            </p>
          </div>

          <div
            className="
              border
              rounded-3xl
              p-7
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition
              bg-white
              transform
              duration-300
            "
          >
            <h2 className="text-gray-500 mb-2">
              📁 Active Projects
            </h2>

            <p className="text-3xl font-bold text-black">
              {projectsCount}
            </p>
          </div>

          <div
            className="
              border
              rounded-3xl
              p-7
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition
              bg-white
              transform
              duration-300
            "
          >
            <h2 className="text-gray-500 mb-2">
              💰 Revenue
            </h2>

            <p className="text-3xl font-bold text-green-600">
              ${revenue}
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}
