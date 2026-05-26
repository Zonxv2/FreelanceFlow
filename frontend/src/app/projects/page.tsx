"use client";

import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/navigation";

type Project = {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  client?: {
    _id: string;
    name: string;
  };
};

type Client = {
  _id: string;
  name: string;
};

export default function ProjectsPage() {

  const [editingId, setEditingId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [budget, setBudget] = useState(0);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const router = useRouter();

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [projectsRes, clientsRes] = await Promise.all([
          api.get("/projects"),
          api.get("/clients"),
        ]);

        setProjects(projectsRes.data);
        setClients(clientsRes.data);
      } catch (error) {
        showMessage("Error loading data 😢", "error");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      if (editingId) {
        await api.put(
          `/projects/${editingId}`,
          { title, description, status, budget }
        );

        setProjects(
          projects.map((project) =>
            project._id === editingId
              ? { ...project, title, description, status, budget }
              : project
          )
        );

        setEditingId("");
        showMessage("Project updated successfully 😄", "success");

      } else {
        const response = await api.post(
          "/projects",
          { title, description, status, budget, client: clientId }
        );

        setProjects([...projects, response.data]);
        showMessage("Project created successfully 😄", "success");
      }

      setTitle("");
      setDescription("");
      setStatus("");
      setBudget(0);

    } catch (error) {
      showMessage("Something went wrong 😢", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await api.delete(`/projects/${id}`);

      setProjects(projects.filter((project) => project._id !== id));
      showMessage("Project deleted 🗑️", "success");

    } catch (error) {
      showMessage("Error deleting project 😢", "error");
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      filterStatus === "All" ? true : project.status === filterStatus;

    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex">

      <Sidebar />

        <main className="flex-1 p-8 pt-16 md:pt-8 text-sm md:text-base">

          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Projects
          </h1>

          {message && (
            <div
              className={`
                fixed
                top-6
                right-6
                px-6
                py-4
                rounded-2xl
                shadow-2xl
                z-50
                flex
                items-center
                gap-4
                text-white
                ${messageType === "success" ? "bg-black" : "bg-red-600"}
              `}
            >
              <span>{message}</span>

              <button
                onClick={() => setMessage("")}
                className="hover:text-gray-300 transition"
              >
                ✕
              </button>
            </div>
          )}

          {/* FILTERS */}
          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-4
              mb-8
              w-full
            "
          >

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
              className="
                border
                p-3
                rounded-2xl
                text-black
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                flex-1
                border
                p-3
                rounded-2xl
                text-black
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          {/* MAIN LAYOUT */}
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-8
              items-start
            "
          >

            {/* FORM */}
            <div className="space-y-4">

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                  bg-white
                  text-black
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <input
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) =>
                  setBudget(Number(e.target.value))
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <select
                value={clientId}
                onChange={(e) =>
                  setClientId(e.target.value)
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                  bg-white
                  text-black
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                <option value="">
                  Select Client
                </option>

                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="
                  w-full
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-white
                  p-4
                  rounded-2xl
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Loading..."
                  : editingId
                  ? "Update Project"
                  : "Create Project"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId("");
                    setTitle("");
                    setDescription("");
                    setStatus("");
                    setBudget(0);
                  }}
                  className="
                    w-full
                    bg-gray-500
                    text-white
                    p-4
                    rounded-2xl
                  "
                >
                  Cancel
                </button>
              )}

            </div>

            {/* PROJECTS */}
            <div className="lg:col-span-2 grid gap-6">

              {filteredProjects.length === 0 && (
                <div
                  className="
                    border
                    rounded-3xl
                    p-7
                    text-center
                  "
                >
                  No projects yet 😄
                </div>
              )}

              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="
                    border
                    rounded-3xl
                    p-7
                    shadow-sm
                    hover:shadow-xl
                    transition
                    space-y-4
                  "
                >

                  <h2 className="text-2xl font-bold">
                    {project.title}
                  </h2>

                  <p className="text-gray-400">
                    {project.description}
                  </p>

                  <p>
                    Client: {project.client?.name}
                  </p>

                  <span
                    className={`
                      inline-block
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-semibold
                      text-white
                      ${
                        project.status === "Active"
                          ? "bg-green-500"
                          : project.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }
                    `}
                  >
                    {project.status}
                  </span>

                  <p className="font-bold text-green-500">
                    Budget: ${project.budget}
                  </p>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        deleteProject(project._id)
                      }
                      className="
                        bg-red-600
                        hover:bg-red-700
                        transition
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(project._id);
                        setTitle(project.title);
                        setDescription(project.description);
                        setStatus(project.status);
                        setBudget(project.budget);
                      }}
                      className="
                        bg-yellow-500
                        hover:bg-yellow-600
                        transition
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Edit
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </main>
    </div>
  );
}
