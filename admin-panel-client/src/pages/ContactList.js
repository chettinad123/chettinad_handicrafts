import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../common/apiClient";
import SummaryApi from "../common/SummaryApi";

const statuses = ["new", "read", "responded"];
const STATUS_TO_LABEL = {
  new: "New",
  read: "Read",
  responded: "Responded",
};
const PAGE_SIZE = 9;

const statusColor = (status) => {
  switch (status) {
    case "new":
      return "text-[#1E63E9]";
    case "read":
      return "text-[#E29C15]";
    case "responded":
      return "text-green-600";
    default:
      return "text-[#2A190C80]";
  }
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContactUsList() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: SummaryApi.getAllContacts.url,
        method: SummaryApi.getAllContacts.method,
      });

      const raw = res.data?.data ?? [];

      const mapped = raw.map((m) => ({
        id: m._id,
        name: m.name,
        email: m.emailAddress,
        message: m.message,
        date: formatDate(m.createdAt),
        status: m.status || "new",
      }));

      setMessages(mapped);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatusId(id);
    const prevMessages = messages;

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );

    try {
      await api({
        url: SummaryApi.editContactStatus.url.replace(":id", id),
        method: SummaryApi.editContactStatus.method,
        data: { status: newStatus },
      });
      toast.success(`Status updated to "${STATUS_TO_LABEL[newStatus]}"!`);
    } catch (err) {
      setMessages(prevMessages);
      toast.error(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 4);

  const confirmDelete = (id) => setDeleteTargetId(id);
  const cancelDelete = () => setDeleteTargetId(null);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api({
        url: SummaryApi.deleteContactById.url.replace(":id", deleteTargetId),
        method: SummaryApi.deleteContactById.method,
      });
      toast.success("Message deleted!");
      setMessages((prev) => prev.filter((m) => m.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete message.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#5B2D07]">Contact Us Messages</h1>

      <div className="mt-4 sm:mt-6 rounded bg-[#FDFBF7] p-4 sm:p-6 md:p-8 shadow-sm">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-3 sm:pl-4 pr-10 sm:pr-11 py-2 sm:py-2.5 text-xs sm:text-sm text-[#2A190C] placeholder:text-[#2A190C]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full w-9 sm:w-11 flex items-center justify-center rounded-r-lg bg-[#E29C15]"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#E29C15]/70 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#2A190C] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 w-full sm:w-auto"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_TO_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full text-left border-collapse border border-[#E29C15] rounded-lg min-w-[850px]">
              <thead>
                <tr className="border border-[#E29C15]">
                  {["Name", "Email", "Message", "Date", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="font-serif text-base sm:text-lg text-[#5B2D07] font-normal pb-2 sm:pb-3 pl-3 sm:pl-4 pr-2 sm:pr-4 pt-2 sm:pt-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-[#2A190C80]">
                      Loading messages...
                    </td>
                  </tr>
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-[#2A190C80]">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 sm:py-4 pl-3 sm:pl-4 pr-2 sm:pr-4 text-xs sm:text-sm text-[#2A190C] whitespace-nowrap">{m.name}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4 text-xs sm:text-sm text-[#2A190C] whitespace-nowrap">{m.email}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4 text-xs sm:text-sm text-[#2A190C] truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs">{m.message}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4 text-xs sm:text-sm text-[#2A190C] whitespace-nowrap">{m.date}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4">
                        <select
                          value={m.status}
                          onChange={(ev) => handleStatusChange(m.id, ev.target.value)}
                          disabled={updatingStatusId === m.id}
                          className={`text-xs sm:text-sm font-medium bg-transparent border-none focus:outline-none cursor-pointer ${statusColor(m.status)} disabled:opacity-50`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_TO_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => navigate(`/admin-panel/contact-us/${m.id}`)}
                            aria-label="View"
                            className="text-[#5B2D07] hover:text-[#E29C15] transition-colors p-1"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(m.id)}
                            aria-label="Delete"
                            className="text-[#5B2D07] hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
          <p className="text-xs sm:text-sm text-[#2A190C80] text-center sm:text-left">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} messages
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors text-xs sm:text-sm flex items-center justify-center"
            >
              {"<"}
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg border font-semibold transition-colors text-xs sm:text-sm flex items-center justify-center ${
                  page === n
                    ? "bg-[#E29C15] text-white border-[#E29C15]"
                    : "border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors text-xs sm:text-sm flex items-center justify-center"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded w-[420px] max-w-[95vw] p-8 shadow-2xl">
            <h3 className="text-[#5B2D07] text-xl font-serif font-medium mb-3">
              Delete Message
            </h3>
            <p className="text-sm text-[#2A190C80] mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="rounded-lg border border-[#E29C15]/50 text-[#5B2D07] hover:bg-[#E29C15]/10 transition-colors px-5 py-2 text-sm font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors px-5 py-2 text-sm font-semibold text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}