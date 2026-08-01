import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../common/apiClient"; // TODO: adjust path to your api.js
import SummaryApi from "../common/SummaryApi"; // TODO: adjust path to your summaryapi.js

const statuses = ["New", "In Progress", "Completed"];
const PAGE_SIZE = 10;

// DB stores lowercase/hyphenated status, UI shows Title Case
const STATUS_TO_LABEL = {
  new: "New",
  "in-progress": "In Progress",
  completed: "Completed",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrdersDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // Delete confirmation modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: SummaryApi.getOrders.url,
        method: SummaryApi.getOrders.method,
      });

      // Response envelope is: { success, data: { orders, total, page, limit, totalPages } }
      const raw = res.data?.data?.orders ?? [];

      const mapped = raw.map((o) => ({
        id: o._id ?? o.id,
        name: o.customerName || o.customer?.name || "—",
        category: o.projectCategory,
        type: o.projectType,
        location: o.location || [o.city, o.state].filter(Boolean).join(", "),
        date: formatDate(o.createdAt),
        status: STATUS_TO_LABEL[o.status] || o.status,
      }));

      setOrders(mapped);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load custom orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status ? o.status === status : true;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 4);

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api({
        url: SummaryApi.deleteOrderById.url.replace(":id", deleteTargetId),
        method: SummaryApi.deleteOrderById.method,
      });
      toast.success("Order deleted!");
      setOrders((prev) => prev.filter((o) => o.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete order.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[#5B2D07]">Custom Orders</h1>

      <div className="mt-6 rounded bg-[#FDFBF7] p-6 sm:p-8 shadow-sm">
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
              className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-4 pr-11 py-2.5 text-sm text-[#2A190C] placeholder:text-[#2A190C]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full w-11 flex items-center justify-center rounded-r-lg bg-[#E29C15]"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#2A190C] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-[#E29C15] rounded-lg ">
            <thead>
              <tr className="border-b border-[#E29C15]">
                {["Name", "Project category", "Product Name", "Location", "Date", "Action"].map((h) => (
                  <th
                    key={h}
                    className="font-serif text-lg text-[#5B2D07] font-normal pb-3 pl-4 pr-4 pt-3 whitespace-nowrap"
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
                    Loading orders...
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-[#2A190C80]">
                    No custom orders found.
                  </td>
                </tr>
              ) : (
                pageItems.map((o) => (
                  <tr key={o.id}>
                    <td className="py-4 pl-4 pr-4 text-sm text-[#2A190C]">{o.name}</td>
                    <td className="py-4 pl-4 pr-4 text-sm text-[#2A190C]">{o.category}</td>
                    <td className="py-4 pl-4 pr-4 text-sm text-[#2A190C]">{o.type}</td>
                    <td className="py-4 pl-4 pr-4 text-sm text-[#2A190C]">{o.location}</td>
                    <td className="py-4 pl-4 pr-4 text-sm text-[#2A190C] whitespace-nowrap">{o.date}</td>
                    <td className="py-4 pl-4 pr-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/admin-panel/orders/${o.id}`)}
                          aria-label="View"
                          className="text-[#5B2D07] hover:text-[#E29C15] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(o.id)}
                          aria-label="Delete"
                          className="text-[#5B2D07] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
          <p className="text-sm text-[#2A190C80]">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Custom order details
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors"
            >
              {"<"}
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-lg border font-semibold transition-colors ${
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
              className="w-9 h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors"
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
              Delete Custom Order
            </h3>
            <p className="text-sm text-[#2A190C80] mb-6">
              Are you sure you want to delete this custom order? This action cannot be undone.
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