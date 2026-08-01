import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Pencil, Trash2, X } from "lucide-react";
import api from "../common/apiClient";
import summaryApi from "../common/SummaryApi";

// NOTE: aligned to the same category list used in BlogForm.jsx (was
// previously "Wood craft" / "Stone craft" here vs "Wood Works" / "Stone
// Works" there — mismatched filters would never have matched real data).
const categories = ["Wood Works", "Stone Works", "Traditional Art Works"];

// Backend stores lowercase status values ("draft" | "published"); label is
// just for display.
const statuses = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const PAGE_SIZE = 5;

/* ─── Delete Confirmation Popup ───────────────────────────────────── */
function DeleteConfirmationPopup({ isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] rounded-lg max-w-md w-full p-8 shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#0B1A35] hover:text-[#0B1A35]/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="w-28 h-28 rounded-full bg-[#EFA9A9] flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-red-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title + subtitle */}
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl text-[#5B2D07] mb-2">Delete Blog Post</h3>
          <p className="text-[#0B1A35]/70 text-sm">
            Are you sure you want to delete this blog post?
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-6 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-[#E29C15] hover:bg-[#C98B24] disabled:opacity-60 transition-colors px-6 py-2 text-sm font-semibold text-white"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogDashboard() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // New states for delete confirmation popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(summaryApi.getBlogs.url);
      const data = response.data?.data || response.data || [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      const errorMsg = err.response?.data?.message || "Failed to load blogs";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch = (b.title || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || b.category === category;
      const matchesStatus = !status || b.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, search, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 4);

  // Delete handlers
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    
    try {
      setDeletingId(deleteTargetId);
      await api.delete(summaryApi.deleteBlogsById.url.replace(":id", deleteTargetId));
      setBlogs((prev) => prev.filter((b) => b._id !== deleteTargetId));
      toast.success("Blog deleted");
      setShowDeletePopup(false);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Error deleting blog:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete blog";
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteTargetId(null);
  };

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={deletingId !== null}
      />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#5B2D07]">Blogs</h1>
        <button
          onClick={() => navigate("/admin-panel/blogs/add-blog")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white w-full sm:w-auto justify-center"
        >
          + Add New Blog
        </button>
      </div>

      <div className="mt-4 sm:mt-6 rounded bg-[#FDFBF7] p-4 sm:p-6 md:p-8 shadow-sm">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-3 sm:pl-4 pr-10 sm:pr-11 py-2 sm:py-2.5 text-xs sm:text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full w-9 sm:w-11 flex items-center justify-center rounded-r-lg bg-[#E29C15]"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#E29C15]/70 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#E29C15]/70 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 w-full sm:w-auto"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#E29C15] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[#2A190C80] font-medium">Loading blogs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full text-left border-collapse border border-[#E29C15] rounded-lg min-w-[640px]">
                  <thead>
                    <tr className="border border-[#E29C15]">
                      {["Title", "Category", "Date", "Status", "Action"].map((h) => (
                        <th
                          key={h}
                          className="font-serif text-base sm:text-lg text-[#5B2D07] font-normal pb-2 sm:pb-3 pl-3 sm:pl-4 pr-2 sm:pr-4 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-[#0B1A35]/50">
                          No blogs found.
                        </td>
                      </tr>
                    ) : (
                      pageItems.map((b) => (
                        <tr key={b._id}>
                          <td className="py-3 sm:py-4 md:py-5 pl-3 sm:pl-4 pr-2 sm:pr-4 text-xs sm:text-sm text-[#0B1A35] max-w-[120px] sm:max-w-xs truncate">
                            {b.title}
                          </td>
                          <td className="py-3 sm:py-4 md:py-5 pl-3 sm:pl-4 pr-2 sm:pr-4 text-xs sm:text-sm text-[#0B1A35] whitespace-nowrap">
                            {b.category}
                          </td>
                          <td className="py-3 sm:py-4 md:py-5 pl-3 sm:pl-4 pr-2 sm:pr-4 text-xs sm:text-sm text-[#0B1A35] whitespace-nowrap">
                            {formatDate(b.createdAt)}
                          </td>
                          <td
                            className={`py-3 sm:py-4 md:py-5 pl-3 sm:pl-4 pr-2 sm:pr-4 text-xs sm:text-sm font-medium whitespace-nowrap capitalize ${
                              b.status === "published" ? "text-green-700" : "text-[#2A190C80]"
                            }`}
                          >
                            {b.status}
                          </td>
                          <td className="py-3 sm:py-4 md:py-5 pr-2 sm:pr-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <button
                                onClick={() => navigate(`/admin-panel/blogs/add-blog?id=${b._id}`)}
                                aria-label="Edit"
                                className="text-[#5B2D07] hover:text-[#E29C15] transition-colors p-1"
                              >
                                <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(b._id)}
                                disabled={deletingId === b._id}
                                aria-label="Delete"
                                className="text-[#5B2D07] hover:text-red-600 transition-colors p-1 disabled:opacity-40"
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
                {filtered.length === 0
                  ? "Showing 0 blogs"
                  : `Showing ${(page - 1) * PAGE_SIZE + 1} to ${Math.min(
                      page * PAGE_SIZE,
                      filtered.length
                    )} of ${filtered.length} blogs`}
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
          </>
        )}
      </div>
    </div>
  );
}