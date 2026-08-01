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

export default function EnquiryDashboard() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: SummaryApi.getAllEnquiries.url,
        method: SummaryApi.getAllEnquiries.method,
      });

      const raw = res.data?.data ?? [];

      const mapped = raw.map((e) => ({
        id: e._id,
        name: e.fullName,
        email: e.emailAddress,
        subject: e.subject,
        date: formatDate(e.createdAt),
        status: e.status || "new",
      }));

      setEnquiries(mapped);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatusId(id);
    const prevEnquiries = enquiries;

    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );

    try {
      await api({
        url: SummaryApi.editEnquiryStatus.url.replace(":id", id),
        method: SummaryApi.editEnquiryStatus.method,
        data: { status: newStatus },
      });
      toast.success(`Status updated to "${STATUS_TO_LABEL[newStatus]}"!`);
    } catch (err) {
      setEnquiries(prevEnquiries);
      toast.error(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

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
        url: SummaryApi.deleteEnquiryById.url.replace(":id", deleteTargetId),
        method: SummaryApi.deleteEnquiryById.method,
      });
      toast.success("Enquiry deleted!");
      setEnquiries((prev) => prev.filter((e) => e.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete enquiry.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#5B2D07]">Enquiries</h1>

      <div className="mt-4 sm:mt-6 rounded bg-[#FDFBF7] p-4 sm:p-6 md:p-8 shadow-sm">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search enquiries..."
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
                  {["Name", "Email", "Subject", "Date", "Status", "Action"].map((h) => (
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
                      Loading enquiries...
                    </td>
                  </tr>
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-[#2A190C80]">
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((e) => (
                    <tr key={e.id}>
                      <td className="py-3 sm:py-4 pl-3 sm:pl-4 pr-2 sm:pr-4 text-xs sm:text-sm text-[#2A190C] whitespace-nowrap">{e.name}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4 text-xs sm:text-sm text-[#2A190C] whitespace-nowrap">{e.email}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4 text-xs sm:text-sm text-[#2A190C] truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs">{e.subject}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4 text-xs sm:text-sm text-[#2A190C] whitespace-nowrap">{e.date}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 pl-3 sm:pl-4">
                        <select
                          value={e.status}
                          onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                          disabled={updatingStatusId === e.id}
                          className={`text-xs sm:text-sm font-medium bg-transparent border-none focus:outline-none cursor-pointer ${statusColor(e.status)} disabled:opacity-50`}
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
                            onClick={() => navigate(`/admin-panel/enquiries/${e.id}`)}
                            aria-label="View"
                            className="text-[#5B2D07] hover:text-[#E29C15] transition-colors p-1"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(e.id)}
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
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} enquiries
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
              Delete Enquiry
            </h3>
            <p className="text-sm text-[#2A190C80] mb-6">
              Are you sure you want to delete this enquiry? This action cannot be undone.
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