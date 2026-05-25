"use client";

import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/navigation";

type Client = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export default function ClientsPage() {

  const [editingId, setEditingId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
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

    const fetchClients = async () => {
      try {
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (error: any) {
        showMessage("Error loading clients 😢", "error");
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      if (editingId) {
        await api.put(
          `/clients/${editingId}`,
          { name, email, phone, company },
        );

        setClients(
          clients.map((client) =>
            client._id === editingId
              ? { ...client, name, email, phone, company }
              : client
          )
        );

        setEditingId("");
        showMessage("Client updated successfully 😄", "success");

      } else {
        const response = await api.post(
          "/clients",
          { name, email, phone, company },
        );

        setClients([...clients, response.data]);
        showMessage("Client created successfully 😄", "success");
      }

      setName("");
      setEmail("");
      setPhone("");
      setCompany("");

    } catch (error) {
      showMessage("Something went wrong 😢", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await api.delete(`/clients/${editingId}`);

      setClients(clients.filter((client) => client._id !== id));
      showMessage("Client deleted 🗑️", "success");

    } catch (error) {
      showMessage("Error deleting client 😢", "error");
    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-8 pt-16 md:pt-8 text-sm md:text-base">

        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Clients
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
              ${messageType === "success"
                ? "bg-black"
                : "bg-red-600"}
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
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
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

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
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

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
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

            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full
                bg-black
                text-white
                p-4
                rounded-2xl
                disabled:opacity-50
              "
            >
              {loading
                ? "Loading..."
                : editingId
                ? "Update Client"
                : "Create Client"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId("");
                  setName("");
                  setEmail("");
                  setPhone("");
                  setCompany("");
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

          {/* CLIENT CARDS */}
          <div className="lg:col-span-2 grid gap-6">

            {clients.map((client) => (

              <div
                key={client._id}
                className="
                  border
                  rounded-3xl
                  p-7
                  shadow-sm
                  hover:shadow-xl
                  transition
                  space-y-3
                "
              >

                <h2 className="text-2xl font-bold">
                  {client.name}
                </h2>

                <p className="text-gray-400">
                  {client.email}
                </p>

                <p className="text-gray-400">
                  {client.phone}
                </p>

                <p className="font-semibold">
                  {client.company}
                </p>

                <div className="flex gap-3 pt-2">

                  <button
                    onClick={() =>
                      deleteClient(client._id)
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
                      setEditingId(client._id);
                      setName(client.name);
                      setEmail(client.email);
                      setPhone(client.phone);
                      setCompany(client.company);
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