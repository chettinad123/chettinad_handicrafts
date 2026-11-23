// import { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search, Pencil, Trash2, AlertTriangle } from "lucide-react";
// import api from "../common/apiClient";
// import SummaryApi from "../common/SummaryApi";

// const statuses = ["active", "inactive"];
// const PAGE_SIZE = 6;

// export default function GalleryDashboard() {
//   const navigate = useNavigate();

//   const [images, setImages] = useState([]);
//   const [categories, setCategories] = useState([]); // real categories from backend
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState(""); // will hold category _id
//   const [status, setStatus] = useState("");
//   const [page, setPage] = useState(1);

//   // ---------- Delete confirmation ----------
//   const [deleteTarget, setDeleteTarget] = useState(null); // holds image object to delete
//   const [deleting, setDeleting] = useState(false);

//   // ---------- Fetch categories (for dropdown) ----------
//   const fetchCategories = async () => {
//     try {
//       const { url, method } = SummaryApi.getAllCategories;
//       const res = await api({ url, method });
//       const data = res.data?.data;
//       setCategories(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to load categories", err);
//       setCategories([]);
//     }
//   };

//   // ---------- Fetch gallery images ----------
//   const fetchImages = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const { url, method } = SummaryApi.getAllGalleryAdmin;
//       const res = await api({ url, method });

//       console.log("API response:", res.data);

//       // backend returns: { success, data: { images, total, page, limit, totalPages } }
//       const list = res.data?.data?.images;
//       setImages(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setError(err?.response?.data?.message || "Failed to load gallery images.");
//       setImages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchImages();
//   }, []);

//   const confirmDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     try {
//       const { url, method } = SummaryApi.deleteGallery;
//       const finalUrl = url.replace(":id", deleteTarget._id);
//       await api({ url: finalUrl, method });
//       setImages((prev) => prev.filter((img) => img._id !== deleteTarget._id));
//       setDeleteTarget(null);
//     } catch (err) {
//       alert(err?.response?.data?.message || "Delete failed.");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const filtered = useMemo(() => {
//     return images.filter((img) => {
//       const matchesSearch = img.title?.toLowerCase().includes(search.toLowerCase());
//       const matchesCategory = !category || img.category?._id === category;
//       const matchesStatus = !status || img.status === status;
//       return matchesSearch && matchesCategory && matchesStatus;
//     });
//   }, [images, search, category, status]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const getPageNumbers = () => {
//     const delta = 2;
//     const range = [];
//     const rangeWithDots = [];
//     let l;

//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
//         range.push(i);
//       }
//     }

//     range.forEach((i) => {
//       if (l) {
//         if (i - l === 2) rangeWithDots.push(l + 1);
//         else if (i - l !== 1) rangeWithDots.push("...");
//       }
//       rangeWithDots.push(i);
//       l = i;
//     });

//     return rangeWithDots;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div>
//       <div className="flex items-start justify-between gap-4 flex-wrap">
//         <h1 className="font-serif text-2xl sm:text-3xl text-[#5B2D07]">Gallery</h1>
//         <button
//           onClick={() => navigate("/admin-panel/gallery/add")}
//           className="inline-flex items-center gap-1.5 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-4 py-2 text-sm font-semibold text-white"
//         >
//           + Add New Image
//         </button>
//       </div>

//       <div className="mt-6 rounded bg-[#FDFBF7] p-6 sm:p-8 shadow-sm">
//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-3 mb-6">
//           <div className="relative flex-1">
//             <input
//               type="text"
//               placeholder="Search images by title..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-4 pr-11 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
//             />
//             <button
//               type="button"
//               className="absolute right-0 top-0 h-full w-11 flex items-center justify-center rounded-r-lg bg-[#E29C15]"
//             >
//               <Search className="w-4 h-4 text-white" />
//             </button>
//           </div>

//           <select
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setPage(1);
//             }}
//             className="rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <select
//             value={status}
//             onChange={(e) => {
//               setStatus(e.target.value);
//               setPage(1);
//             }}
//             className="rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
//           >
//             <option value="">All Status</option>
//             {statuses.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* States */}
//         {loading && (
//           <p className="text-center text-sm text-[#2A190C80] py-10">Loading gallery...</p>
//         )}
//         {!loading && error && (
//           <div className="text-center py-10">
//             <p className="text-sm text-red-600 mb-3">{error}</p>
//             <button onClick={fetchImages} className="text-sm font-semibold text-[#E29C15] underline">
//               Retry
//             </button>
//           </div>
//         )}
//         {!loading && !error && filtered.length === 0 && (
//           <p className="text-center text-sm text-[#2A190C80] py-10">No images found.</p>
//         )}

//         {/* Grid */}
//         {!loading && !error && filtered.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {pageItems.map((img) => (
//               <div key={img._id} className="rounded shadow shadow-[#00000040] overflow-hidden bg-[#FDFBF7] shadow-sm">
//                 <img src={img.imageUrl} alt={img.title} className="w-full h-44 object-cover" />
//                 <div className="p-4">
//                   <h3 className="font-serif text-lg text-[#5B2D07]">{img.title}</h3>
//                   <p className="text-sm text-[#E29C15] font-medium mt-0.5">{img.category?.name}</p>
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-xs text-[#2A190C]">
//                       {img.createdAt
//                         ? new Date(img.createdAt).toLocaleDateString("en-US", {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })
//                         : ""}
//                     </span>
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => navigate(`/admin-panel/gallery/edit/${img._id}`)}
//                         aria-label="Edit"
//                         className="text-[#2A190C] hover:text-[#E29C15] transition-colors"
//                       >
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setDeleteTarget(img)}
//                         aria-label="Delete"
//                         className="text-[#2A190C] hover:text-red-600 transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && !error && filtered.length > 0 && (
//           <div className="flex items-center justify-between mt-8 flex-wrap gap-3">
//             <p className="text-sm text-[#2A190C80]">
//               Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
//               {filtered.length} Images
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="w-9 h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors"
//               >
//                 {"<"}
//               </button>
//               {pageNumbers.map((n, index) =>
//                 n === "..." ? (
//                   <span key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-[#0B1A35]/40">
//                     ...
//                   </span>
//                 ) : (
//                   <button
//                     key={n}
//                     onClick={() => setPage(n)}
//                     className={`w-9 h-9 rounded-lg border font-semibold transition-colors ${
//                       page === n
//                         ? "bg-[#E29C15] text-white border-[#E29C15]"
//                         : "border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 )
//               )}
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="w-9 h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors"
//               >
//                 {">"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded w-[420px] max-w-[95vw] p-8 shadow-2xl flex flex-col items-center text-center">
//             <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
//               <AlertTriangle className="w-8 h-8 text-red-600" strokeWidth={2} />
//             </div>

//             <h3 className="text-[#5B2D07] text-xl font-serif font-medium mb-2">
//               Delete this image?
//             </h3>
//             <p className="text-sm text-[#0B1A35]/60 mb-6">
//               "{deleteTarget.title}" will be permanently removed. This action cannot be undone.
//             </p>

//             <div className="flex gap-3 w-full">
//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 disabled={deleting}
//                 className="flex-1 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={deleting}
//                 className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 transition-colors px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
//               >
//                 {deleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pencil, Trash2, AlertTriangle } from "lucide-react";
import api from "../common/apiClient";
import SummaryApi from "../common/SummaryApi";

const statuses = ["active", "inactive"];
const PAGE_SIZE = 6;

export default function GalleryDashboard() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  // Server-side pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search input to avoid firing API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const { url, method } = SummaryApi.getAllCategories;
      const res = await api({ url, method });
      const data = res.data?.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  // Fetch paginated gallery images from backend
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { url, method } = SummaryApi.getAllGalleryAdmin;

      const params = {
        page,
        limit: PAGE_SIZE,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        ...(category && { category }),
        ...(status && { status }),
      };

      const res = await api({ url, method, params });
      const data = res.data?.data;

      setImages(Array.isArray(data?.images) ? data.images : []);
      setTotal(data?.total ?? 0);
      setTotalPages(Math.max(1, data?.totalPages ?? 1));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load gallery images.");
      setImages([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, status]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { url, method } = SummaryApi.deleteGallery;
      const finalUrl = url.replace(":id", deleteTarget._id);
      await api({ url: finalUrl, method });
      setDeleteTarget(null);

      // Go back one page if deleting the last remaining item on a page > 1
      if (images.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchImages();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#5B2D07]">Gallery</h1>
        <button
          onClick={() => navigate("/admin-panel/gallery/add")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-4 py-2 text-sm font-semibold text-white"
        >
          + Add New Image
        </button>
      </div>

      <div className="mt-6 rounded bg-[#FDFBF7] p-6 sm:p-8 shadow-sm">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search images by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-4 pr-11 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
            />
            <button
              type="button"
              onClick={() => {
                setDebouncedSearch(search);
                setPage(1);
              }}
              className="absolute right-0 top-0 h-full w-11 flex items-center justify-center rounded-r-lg bg-[#E29C15]"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-sm text-[#2A190C80] py-10">Loading gallery...</p>
        )}
        {!loading && error && (
          <div className="text-center py-10">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button onClick={fetchImages} className="text-sm font-semibold text-[#E29C15] underline">
              Retry
            </button>
          </div>
        )}
        {!loading && !error && images.length === 0 && (
          <p className="text-center text-sm text-[#2A190C80] py-10">No images found.</p>
        )}

        {/* Grid */}
        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img._id} className="rounded shadow shadow-[#00000040] overflow-hidden bg-[#FDFBF7] shadow-sm">
                <img src={img.imageUrl} alt={img.title} className="w-full h-72 object-fill" />
                <div className="p-4">
                  <h3 className="font-serif text-lg text-[#5B2D07]">{img.title}</h3>
                  <p className="text-sm text-[#E29C15] font-medium mt-0.5">{img.category?.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#2A190C]">
                      {img.createdAt
                        ? new Date(img.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/admin-panel/gallery/edit/${img._id}`)}
                        aria-label="Edit"
                        className="text-[#2A190C] hover:text-[#E29C15] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(img)}
                        aria-label="Delete"
                        className="text-[#2A190C] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && images.length > 0 && (
          <div className="flex items-center justify-between mt-8 flex-wrap gap-3">
            <p className="text-sm text-[#2A190C80]">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of{" "}
              {total} Images
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors"
              >
                {"<"}
              </button>
              {pageNumbers.map((n, index) =>
                n === "..." ? (
                  <span key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-[#0B1A35]/40">
                    ...
                  </span>
                ) : (
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
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-[#E29C15] text-[#E29C15] disabled:opacity-40 hover:bg-[#E29C15] hover:text-white transition-colors"
              >
                {">"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded w-[420px] max-w-[95vw] p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <AlertTriangle className="w-8 h-8 text-red-600" strokeWidth={2} />
            </div>

            <h3 className="text-[#5B2D07] text-xl font-serif font-medium mb-2">
              Delete this image?
            </h3>
            <p className="text-sm text-[#0B1A35]/60 mb-6">
              "{deleteTarget.title}" will be permanently removed. This action cannot be undone.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 transition-colors px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
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