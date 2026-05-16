import { useEffect, useState } from "react";
import API from "../api/axios";
import { FiMoon, FiSun } from "react-icons/fi";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [source, setSource] =
    useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [name, setName] = useState("");

  const [email, setEmail] =
    useState("");

  const [leadStatus, setLeadStatus] =
    useState("New");

  const [leadSource, setLeadSource] =
    useState("Website");

  const [sort, setSort] =
    useState("latest");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [selectedLead, setSelectedLead] =
    useState<any>(null);

  const [editingLead, setEditingLead] =
    useState<any>(null);

  const [darkMode, setDarkMode] =
    useState(false);

  const [role, setRole] =
    useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/leads?search=${debouncedSearch}&status=${status}&source=${source}&sort=${sort}&page=${page}`
      );

      setLeads(res.data.leads);

      setTotalPages(res.data.totalPages);

      setRole(res.data.role);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [
    debouncedSearch,
    status,
    source,
    sort,
    page,
  ]);

  const handleDelete = async (
    id: string
  ) => {
    try {
      await API.delete(`/leads/${id}`);

      fetchLeads();
    } catch (error) {
      console.log(error);

      alert(
        "Delete failed (admin only)"
      );
    }
  };

  const createLead = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await API.post("/leads", {
        name,
        email,
        status: leadStatus,
        source: leadSource,
      });

      setName("");

      setEmail("");

      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Status",
      "Source",
    ];

    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv",
    });

    const url =
      window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "leads.csv";

    a.click();
  };

  const updateLead = async () => {
    try {
      await API.put(
        `/leads/${editingLead._id}`,
        editingLead
      );

      setEditingLead(null);

      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 transition ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Smart Leads Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <button
  onClick={() =>
    setDarkMode(!darkMode)
  }
  className={`p-2 rounded-full transition ${
    darkMode
      ? "bg-yellow-400 text-black"
      : "bg-gray-800 text-white"
  }`}
>
  {darkMode ? (
    <FiSun size={20} />
  ) : (
    <FiMoon size={20} />
  )}
</button>
 

          <button
            onClick={exportCSV}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              window.location.href =
                "/";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <form
        onSubmit={createLead}
        className={`p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 ${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        }`}
      >
        <input
          type="text"
          placeholder="Lead Name"
          className={`border p-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <input
          type="email"
          placeholder="Lead Email"
          className={`border p-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <select
          className={`border p-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={leadStatus}
          onChange={(e) =>
            setLeadStatus(e.target.value)
          }
        >
          <option value="New">New</option>

          <option value="Contacted">
            Contacted
          </option>

          <option value="Qualified">
            Qualified
          </option>

          <option value="Lost">
            Lost
          </option>
        </select>

        <select
          className={`border p-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={leadSource}
          onChange={(e) =>
            setLeadSource(e.target.value)
          }
        >
          <option value="Website">
            Website
          </option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="Referral">
            Referral
          </option>
        </select>

        <button className="bg-black text-white rounded px-4 py-2">
          Add Lead
        </button>
      </form>

      <div
        className={`p-4 rounded shadow mb-6 flex gap-4 flex-wrap ${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        }`}
      >
        <input
          type="text"
          placeholder="Search"
          className={`border p-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className={`border p-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            All Status
          </option>

          <option value="New">
            New
          </option>

          <option value="Contacted">
            Contacted
          </option>

          <option value="Qualified">
            Qualified
          </option>

          <option value="Lost">
            Lost
          </option>
        </select>

        <select
          className={`border p-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={source}
          onChange={(e) =>
            setSource(e.target.value)
          }
        >
          <option value="">
            All Sources
          </option>

          <option value="Website">
            Website
          </option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="Referral">
            Referral
          </option>
        </select>

        <select
          className={`border rounded-lg p-3 ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white"
          }`}
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="latest">
            Latest
          </option>

          <option value="oldest">
            Oldest
          </option>
        </select>
      </div>

      <div
        className={`rounded shadow overflow-hidden ${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        }`}
      >
        {loading ? (
          <div className="p-6">
            Loading...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-semibold mb-2">
              No Leads Found
            </h2>

            <p className="text-gray-500">
              Try changing filters or add
              a new lead.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead
              className={`${
                darkMode
                  ? "bg-gray-700"
                  : "bg-gray-200"
              }`}
            >
              <tr>
                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Source
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className={`border-t transition ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    {lead.name}
                  </td>

                  <td className="p-3">
                    {lead.email}
                  </td>

                  <td className="p-3">
                    {lead.status}
                  </td>

                  <td className="p-3">
                    {lead.source}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        setSelectedLead(
                          lead
                        )
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        setEditingLead(
                          lead
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    {role === "admin" && (
                      <button
                        onClick={() =>
                          handleDelete(
                            lead._id
                          )
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Prev
        </button>

        <span className="flex items-center">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={
            page === totalPages
          }
          onClick={() =>
            setPage(page + 1)
          }
          className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div
            className={`rounded-2xl p-6 w-full max-w-md ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">
              Lead Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">
                  Name
                </p>

                <p className="font-medium">
                  {selectedLead.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Email
                </p>

                <p className="font-medium">
                  {selectedLead.email}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <p className="font-medium">
                  {selectedLead.status}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Source
                </p>

                <p className="font-medium">
                  {selectedLead.source}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedLead(null)
                }
                className="w-full bg-black text-white py-3 rounded-lg mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div
            className={`rounded-2xl p-6 w-full max-w-md ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              Edit Lead
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={editingLead.name}
                onChange={(e) =>
                  setEditingLead({
                    ...editingLead,
                    name:
                      e.target.value,
                  })
                }
                className={`w-full border p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white"
                }`}
              />

              <input
                type="email"
                value={editingLead.email}
                onChange={(e) =>
                  setEditingLead({
                    ...editingLead,
                    email:
                      e.target.value,
                  })
                }
                className={`w-full border p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white"
                }`}
              />

              <select
                value={editingLead.status}
                onChange={(e) =>
                  setEditingLead({
                    ...editingLead,
                    status:
                      e.target.value,
                  })
                }
                className={`w-full border p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white"
                }`}
              >
                <option value="New">
                  New
                </option>

                <option value="Contacted">
                  Contacted
                </option>

                <option value="Qualified">
                  Qualified
                </option>

                <option value="Lost">
                  Lost
                </option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setEditingLead(
                      null
                    )
                  }
                  className="w-full border py-3 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={updateLead}
                  className="w-full bg-black text-white py-3 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;