import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImageIcon, Plus, X, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../common/apiClient";
import SummaryApi from "../common/SummaryApi";

export default function AddGallery() {
  const navigate = useNavigate();
  const { id } = useParams(); // present only in edit mode
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null); // null = no new file chosen
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [addingCategory, setAddingCategory] = useState(false);

  // ---------- Success modal ----------
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ---------- Fetch categories ----------
  const fetchCategories = async () => {
    try {
      const { url, method } = SummaryApi.getAllCategories;
      const res = await api({ url, method });
      const data = res.data?.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast.error("Failed to load categories.");
      setCategories([]);
    }
  };

  // ---------- Fetch existing gallery item (edit mode) ----------
  const fetchGalleryItem = async () => {
    try {
      setInitialLoading(true);
      const { url, method } = SummaryApi.getGalleryById;
      const res = await api({
        url: url.replace(":id", id),
        method,
      });
      const item = res.data?.data;

      if (item) {
        setFormData({
          title: item.title || "",
          category: item.category?._id || item.category || "",
          description: item.description || "",
        });
        if (item.imageUrl) {
          setPreviewUrl(item.imageUrl);
        }
      }
    } catch (err) {
      console.error("Failed to load gallery item", err);
      toast.error("Failed to load gallery item.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchGalleryItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  // ---------- Create category ----------
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    setAddingCategory(true);
    try {
      const { url, method } = SummaryApi.createCategory;
      const res = await api({
        url,
        method,
        data: {
          name: newCategory.name.trim(),
          description: newCategory.description.trim(),
        },
      });

      const created = res.data?.data;
      if (created?._id) {
        setCategories((prev) => [...prev, created]);
        setFormData((prev) => ({ ...prev, category: created._id }));
      } else {
        await fetchCategories();
      }

      setNewCategory({ name: "", description: "" });
      setShowCategoryPopup(false);
      toast.success("Category added successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add category.");
    } finally {
      setAddingCategory(false);
    }
  };

  // ---------- Submit: create or update ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !imageFile) {
      toast.error("Please upload an image.");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      if (imageFile) {
        payload.append("galleryImage", imageFile); // only if new file chosen
      }

      if (isEditMode) {
        const { url, method } = SummaryApi.editGallery;
        await api({
          url: url.replace(":id", id),
          method,
          data: payload,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Gallery image has been updated successfully.");
      } else {
        const { url, method } = SummaryApi.createGallery;
        await api({
          url,
          method,
          data: payload,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Gallery image has been posted successfully.");
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/admin-panel/gallery");
      }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#5B2D07] text-sm">
        Loading gallery item...
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#5B2D07]">
            {isEditMode ? "Edit Gallery Image" : "Add New Gallery Image"}
          </h1>
          <p className="mt-1 text-sm text-[#2A190C80]">
            Gallery &gt; {isEditMode ? "Edit gallery image" : "Add New gallery image"}
          </p>
        </div>

        <button
          onClick={() => navigate("/admin-panel/gallery")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </button>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded bg-[#FDFBF7] p-6 sm:p-8 shadow-sm"
      >
        <h2 className="font-serif text-xl text-[#5B2D07] mb-6">Image Information</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
              Image Title<span className="text-[#E29C15] ml-0.5">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter image title here..."
              value={formData.title}
              onChange={handleChange("title")}
              className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
              Image Upload{!isEditMode && <span className="text-[#E29C15] ml-0.5">*</span>}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-[#E29C15]/70 px-6 py-12 text-center cursor-pointer transition-colors overflow-hidden ${
                isDragging ? "border-[#E29C15] bg-[#E29C15]/5" : "border-[#E29C15]/60 hover:border-[#E29C15]"
              }`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg object-contain" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-[#0B1A35]/40" />
                  <span className="text-sm text-[#0B1A35]/60">Drag and drop an image here</span>
                  <span className="text-xs text-[#0B1A35]/40">Recommended size: 400 × 400 px</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
            {isEditMode && (
              <p className="mt-1.5 text-xs text-[#0B1A35]/50">
                Click the box to upload a new image, or leave it to keep the current one.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">Category</label>
            <div className="flex gap-2">
              <select
                value={formData.category}
                onChange={handleChange("category")}
                required
                className="flex-1 rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] appearance-none focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryPopup(true)}
                aria-label="Add new category"
                className="flex items-center justify-center w-11 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
              Short Description<span className="text-[#E29C15] ml-0.5">*</span>
            </label>
            <textarea
              rows={4}
              required
              maxLength={160}
              placeholder="Enter short description (max 160 characters)..."
              value={formData.description}
              onChange={handleChange("description")}
              className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 resize-none"
            />
          </div>
        </div>
      </form>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-[#E29C15] hover:bg-[#C98B24] disabled:opacity-60 transition-colors px-6 py-4 text-sm sm:text-base font-semibold text-white"
      >
        {loading ? "Saving..." : isEditMode ? "Update Gallery Image" : "Add Image to Gallery"}
      </button>

      {/* Add New Category Popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded w-[480px] max-w-[95vw] p-8 shadow-2xl min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[#5B2D07] text-2xl font-serif font-medium">
                Add Category Name
              </h3>
              <button
                onClick={() => {
                  setShowCategoryPopup(false);
                  setNewCategory({ name: "", description: "" });
                }}
                className="text-[#5B2D07] hover:text-[#5B2D07]/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#5B2D07] mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Category name here.."
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[#E29C15]/50 bg-white px-4 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5B2D07] mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter category description (optional)..."
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[#E29C15]/50 bg-white px-4 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleAddCategory}
                  disabled={addingCategory}
                  className="rounded-lg bg-[#E29C15] hover:bg-[#C98B24] disabled:opacity-60 transition-colors px-6 py-2 text-sm font-semibold text-white"
                >
                  {addingCategory ? "Adding..." : "+ Add New Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white rounded w-[480px] max-w-[95vw] p-8 shadow-2xl min-h-[300px] flex flex-col items-center justify-center text-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-6 right-6 text-[#5B2D07] hover:text-[#5B2D07]/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
            </div>

            <h3 className="text-[#5B2D07] text-2xl font-serif font-medium mb-2">
              Success!
            </h3>
            <p className="text-sm text-[#0B1A35]/70">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}