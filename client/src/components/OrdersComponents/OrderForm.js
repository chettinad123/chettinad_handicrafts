import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // adjust if you use a different router hook
import { User, Phone, Mail, MapPin, UploadCloud } from "lucide-react";
import api from "../../common/apiClient";
import summaryApi from "../../common/SummaryApi";

const OTHERS_VALUE = "OTHERS";

function IconField({ icon: Icon, label, required, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[#E29C15] text-[#E29C15] flex-shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div className="flex-1">
        <label className="block font-serif text-sm text-[#5B2D07] mb-1.5">
          {label}
          {required && <span className="text-[#E29C15] ml-0.5">*</span>}
        </label>
        {children}
      </div>
    </div>
  );
}

const inputClasses =
  "w-full rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50";

export default function OrderForm() {
  const location = useLocation();
  const preselectedItem = location.state?.item || null;

const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
  email: "",
  city: "",        // changed from cityState
  state: "",       // new field
  projectCategory: preselectedItem?.categoryId || "",   // ✅ matches normalizeItem
  customCategory: "",
  productName: preselectedItem?.id || "",               // ✅ matches normalizeItem
  customProductName: "",
  description: "",
  agreed: false,
});
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");

  const isCategoryOthers = formData.projectCategory === OTHERS_VALUE;
  const isProductOthers = formData.productName === OTHERS_VALUE;

  // Scroll to the form if we arrived via the Order button (hash target)
  useEffect(() => {
    if (location.hash === "#order-form") {
      const el = document.getElementById("order-form");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const res = await api({
          url: summaryApi.getCategory.url,
          method: summaryApi.getCategory.method,
        });
        setCategories(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategoriesError("Could not load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch gallery images for the selected category (skip if "Others" or empty)
  useEffect(() => {
    if (!formData.projectCategory || isCategoryOthers) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError("");
      try {
        const res = await api({
          url: summaryApi.getGalleryImagesByCategory.url,
          method: summaryApi.getGalleryImagesByCategory.method,
          params: {
            category: formData.projectCategory,
            status: "active",
            limit: 100,
          },
        });
        setProducts(res?.data?.data?.images || []);
      } catch (err) {
        console.error("Failed to load gallery images:", err);
        setProductsError("Could not load items for this category.");
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [formData.projectCategory, isCategoryOthers]);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "projectCategory") {
        // Reset dependent fields whenever category changes
        next.productName = "";
        next.customProductName = "";
        if (value !== OTHERS_VALUE) next.customCategory = "";
      }
      if (field === "productName" && value !== OTHERS_VALUE) {
        next.customProductName = "";
      }
      return next;
    });
    if (submitStatus) setSubmitStatus(null);
  };

  const addFiles = (fileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  };
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resolve final category/product values (custom text wins when "Others" chosen)
const finalCategory = isCategoryOthers
  ? formData.customCategory.trim()
  : categories.find((c) => c._id === formData.projectCategory)?.name || "";

const finalProduct =
  isCategoryOthers || isProductOthers
    ? formData.customProductName.trim()
    : products.find((p) => p._id === formData.productName)?.title || "";

    if (!formData.agreed) {
      setSubmitStatus("error");
      setErrorMessage(
        "Please agree to the privacy policy and terms & conditions.",
      );
      return;
    }
    if (!finalCategory) {
      setSubmitStatus("error");
      setErrorMessage("Please select or enter a project category.");
      return;
    }
    if (!finalProduct) {
      setSubmitStatus("error");
      setErrorMessage("Please select or enter a product name.");
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      console.log("Submitting order with:", {
        finalCategory,
        finalProduct,
        formData,
      }); // TEMP debug log

      const payload = new FormData();
      payload.append("customerName", formData.fullName);
      payload.append("phoneNumber", formData.phone);
      payload.append("email", formData.email);
      payload.append("city", formData.city || "");
      payload.append("state", formData.state || "");
      payload.append("projectCategory", finalCategory);
      payload.append("projectType", finalProduct);
      payload.append("projectDescription", formData.description);

      if (files.length > 0) {
        payload.append("referenceImage", files[0]);
      }

      const res = await api({
        url: summaryApi.createOrders.url,
        method: summaryApi.createOrders.method,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Order submit response:", res); // TEMP debug log

      setSubmitStatus("success");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        projectCategory: "",
        customCategory: "",
        productName: "",
        customProductName: "",
        description: "",
        agreed: false,
      });
      setFiles([]);
    } catch (err) {
      console.error("Failed to submit custom order:", err); // check this in console
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
      );
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. Personal Information */}
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-regular text-[#5B2D07] mb-6">
              1. Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <IconField icon={User} label="Full Name" required>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  className={inputClasses}
                  disabled={submitting}
                  required
                />
              </IconField>
              <IconField icon={Phone} label="Phone Number" required>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className={inputClasses}
                  disabled={submitting}
                  required
                />
              </IconField>
              <IconField icon={Mail} label="Email Address" required>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className={inputClasses}
                  disabled={submitting}
                  required
                />
              </IconField>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <IconField icon={MapPin} label="City" required>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange("city")}
                  className={inputClasses}
                  disabled={submitting}
                  required
                />
              </IconField>
              <IconField icon={MapPin} label="State" required>
                <input
                  type="text"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange("state")}
                  className={inputClasses}
                  disabled={submitting}
                  required
                />
              </IconField>
            </div>
          </div>

          {/* 2. Project Information */}
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-regular text-[#5B2D07] mb-6">
              2. Project Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block font-serif text-sm text-[#5B2D07] mb-1.5">
                  Project Category
                  <span className="text-[#E29C15] ml-0.5">*</span>
                </label>
                <select
                  value={formData.projectCategory}
                  onChange={handleChange("projectCategory")}
                  className={`${inputClasses} appearance-none`}
                  disabled={submitting || categoriesLoading}
                  required
                >
                  <option value="" disabled>
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select Project Category"}
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                  <option value={OTHERS_VALUE}>Others</option>
                </select>
                {categoriesError && (
                  <p className="mt-1 text-xs text-red-600">{categoriesError}</p>
                )}
                {isCategoryOthers && (
                  <input
                    type="text"
                    placeholder="Type your project category"
                    value={formData.customCategory}
                    onChange={handleChange("customCategory")}
                    className={`${inputClasses} mt-2`}
                    disabled={submitting}
                    required
                  />
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block font-serif text-sm text-[#5B2D07] mb-1.5">
                  Product Name<span className="text-[#E29C15] ml-0.5">*</span>
                </label>

                {isCategoryOthers ? (
                  // When category itself is custom, product must be typed too
                  <input
                    type="text"
                    placeholder="Type the product name"
                    value={formData.customProductName}
                    onChange={handleChange("customProductName")}
                    className={inputClasses}
                    disabled={submitting}
                    required
                  />
                ) : (
                  <>
                    <select
                      value={formData.productName}
                      onChange={handleChange("productName")}
                      className={`${inputClasses} appearance-none`}
                      disabled={
                        submitting ||
                        !formData.projectCategory ||
                        productsLoading
                      }
                      required
                    >
                      <option value="" disabled>
                        {!formData.projectCategory
                          ? "Select a category first"
                          : productsLoading
                            ? "Loading..."
                            : "Select Product"}
                      </option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title}
                        </option>
                      ))}
                      <option value={OTHERS_VALUE}>Others</option>
                    </select>
                    {productsError && (
                      <p className="mt-1 text-xs text-red-600">
                        {productsError}
                      </p>
                    )}
                    {isProductOthers && (
                      <input
                        type="text"
                        placeholder="Type the product name"
                        value={formData.customProductName}
                        onChange={handleChange("customProductName")}
                        className={`${inputClasses} mt-2`}
                        disabled={submitting}
                        required
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3. Project Requirements */}
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-sregular text-[#5B2D07] mb-6">
              3. Project Requirements
            </h2>
            <label className="block font-serif text-sm text-[#5B2D07] mb-1.5">
              Project Description
              <span className="text-[#E29C15] ml-0.5">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Describe your requirements, prefered style, dimensions, design ideas, etc."
              value={formData.description}
              onChange={handleChange("description")}
              className={`${inputClasses} resize-none`}
              disabled={submitting}
              required
            />
          </div>

          {/* 4. Upload Reference Image */}
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-regular text-[#5B2D07] mb-3">
              4. Upload Reference Image
            </h2>
            <p className="text-sm text-[#5B2D07] mb-4">
              Upload a reference image, sketch or design idea (Optional — only
              the first file will be saved)
            </p>
            <div
              onClick={() => !submitting && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!submitting) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={submitting ? undefined : handleDrop}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-[#E29C15] px-6 py-14 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-[#E29C15] bg-[#E29C15]/5"
                  : "border-[#E29C15]/60 hover:border-[#E29C15]"
              } ${submitting ? "opacity-60 pointer-events-none" : ""}`}
            >
              <UploadCloud className="w-6 h-6 text-[#0B1A35]/50" />
              <span className="text-sm text-[#0B1A35]/60">
                Drag &amp; drop files here
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </div>
            {files.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-[#0B1A35] bg-[#E29C15]/10 border border-[#E29C15]/40 rounded-full px-3 py-1"
                  >
                    {file.name}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-[#E29C15] hover:text-[#C98B24] font-semibold"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Agreement + Submit */}
          <div>
            <label className="flex items-start gap-2 text-sm text-[#0B1A35]">
              <input
                type="checkbox"
                checked={formData.agreed}
                onChange={handleChange("agreed")}
                className="mt-0.5 w-4 h-4 accent-[#E29C15]"
                disabled={submitting}
                required
              />
              <span>
                I agree to the{" "}
                <a
                  href="/privacy-policy"
                  className="text-[#E29C15] hover:underline"
                >
                  privacy policy
                </a>{" "}
                and{" "}
                <a
                  href="/terms-and-conditions"
                  className="text-[#E29C15] hover:underline"
                >
                  terms &amp; conditions
                </a>
              </span>
            </label>

            {submitStatus === "success" && (
              <p className="mt-3 text-sm text-green-700">
                Thank you! Your custom order request has been submitted — we'll
                get back to you shortly.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-8 py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Custom Order"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}