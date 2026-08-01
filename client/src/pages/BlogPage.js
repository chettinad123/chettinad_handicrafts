import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import api from "../common/apiClient";
import SummaryApi from "../common/SummaryApi";

const PAGE_SIZE = 3;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ---------- Helpers: derive display fields from backend blog doc ----------
// Strip any HTML tags (e.g. <b>, <i>, <u>, <br> saved by the rich-text
// paragraph editor) down to plain text, so the article-list excerpt
// never shows literal markup.
const stripHtml = (html) => {
  if (!html || typeof html !== "string") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
};

const getExcerpt = (content, maxLen = 140) => {
  if (!Array.isArray(content)) return "";
  const textBlock = content.find((b) => b.type === "text" && b.text);
  if (!textBlock) return "";
  const plain = stripHtml(textBlock.text);
  return plain.length > maxLen ? plain.slice(0, maxLen).trim() + "..." : plain;
};

const estimateReadTime = (content) => {
  if (!Array.isArray(content)) return "1 Min Read";
  const wordCount = content
    .filter((b) => b.type === "text" || b.type === "quote")
    .reduce((acc, b) => acc + (b.text ? b.text.split(/\s+/).length : 0), 0);
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} Min${minutes > 1 ? "s" : ""} Read`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function BlogPage() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Refs for animation triggers
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);

  const headerControls = useAnimation();
  const sidebarControls = useAnimation();

  const headerInView = useInView(headerRef, { once: true, amount: 0 });
  const sidebarInView = useInView(sidebarRef, { once: true, amount: 0 });

  useEffect(() => {
    if (headerInView) headerControls.start("visible");
  }, [headerInView, headerControls]);
  useEffect(() => {
    if (sidebarInView) sidebarControls.start("visible");
  }, [sidebarInView, sidebarControls]);

  // ---------- Fetch blogs ----------
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const { url, method } = SummaryApi.getBlogs;
      const res = await api({ url, method });
      const data = res.data?.data;
      const published = Array.isArray(data)
        ? data.filter((b) => b.status === "published")
        : [];
      setBlogs(published);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load blog articles.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ---------- Derived categories with counts ----------
  const categories = useMemo(() => {
    const map = {};
    blogs.forEach((b) => {
      if (!b.category) return;
      map[b.category] = (map[b.category] || 0) + 1;
    });
    return Object.entries(map).map(([label, count]) => ({ label, count }));
  }, [blogs]);

  // ---------- Filtered list ----------
  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch = b.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || b.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        {/* Page heading */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerControls}
          variants={fadeInUp}
          className="text-left mb-10"
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-regular text-[#5B2D07]">
            All Articles
          </h1>
          <div className="mt-3 w-14 h-[3px] bg-[#E29C15]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main: article list */}
          <div className="lg:col-span-2 space-y-6">
            {loading && (
              <p className="text-sm text-[#2A190C80] py-10 text-center">Loading articles...</p>
            )}

            {!loading && error && (
              <div className="text-center py-10">
                <p className="text-sm text-red-600 mb-3">{error}</p>
                <button onClick={fetchBlogs} className="text-sm font-semibold text-[#E29C15] underline">
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <p className="text-sm text-[#2A190C80] py-10 text-center">No articles found.</p>
            )}

            {!loading && !error && filtered.length > 0 && (
              <motion.div
                key={currentPage}
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-6"
              >
                {pageItems.map((article) => (
                  <motion.article
                    key={article._id}
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row gap-5 rounded-lg border border-[#E29C15] overflow-hidden p-4"
                  >
                    <motion.img
                      src={article.heroimage?.url}
                      alt={article.title}
                      className="w-full sm:w-56 h-44 object-cover rounded-lg flex-shrink-0"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="flex-1 flex flex-col text-left">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07] leading-snug">
                          {article.title}
                        </h2>
                        <span className="text-xs sm:text-sm font-medium text-[#E29C15] flex-shrink-0">
                          {article.category}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#2A190C]">
                        {getExcerpt(article.content)}
                      </p>

                      <div className="mt-auto pt-4 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-[#2A190C]/70">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#E29C15]" />
                            {formatDate(article.createdAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#E29C15]" />
                            {estimateReadTime(article.content)}
                          </span>
                        </div>

                        <motion.button
                          onClick={() => navigate(`/blog-view/${article._id}`)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-[#E29C15] hover:text-[#C98B24] transition-colors"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          Read more
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && !error && filtered.length > 0 && (
              <motion.div
                initial="visible"
                animate="visible"
                variants={fadeInUp}
                className="flex items-center justify-center gap-2 pt-6"
              >
                <motion.button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E29C15]/60 text-[#5B2D07] disabled:opacity-40 hover:border-[#E29C15] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-[#E29C15] border-[#E29C15] text-white"
                        : "border-[#E29C15]/60 text-[#5B2D07] hover:border-[#E29C15]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                ))}

                <motion.button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E29C15]/60 text-[#5B2D07] disabled:opacity-40 hover:border-[#E29C15] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            ref={sidebarRef}
            initial="hidden"
            animate={sidebarControls}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Search */}
            <motion.div variants={fadeInLeft} className="flex items-stretch gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles..."
                className="flex-1 rounded-lg border border-[#E29C15]/70 bg-transparent px-4 py-2.5 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
              <motion.button
                type="button"
                aria-label="Search"
                className="flex items-center justify-center w-11 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>

            {/* Categories */}
            <motion.div variants={fadeInRight} className="rounded-lg border border-[#E29C15] px-5 py-5 text-left">
              <h3 className="font-serif text-xl text-[#5B2D07] mb-1">Categories</h3>
              <div className="w-10 h-[2px] bg-[#E29C15] mb-4" />
              {categories.length === 0 ? (
                <p className="text-sm text-[#2A190C]/60">No categories yet.</p>
              ) : (
                <ul className="space-y-3">
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button
                      onClick={() => {
                        setActiveCategory("");
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between text-sm transition-colors ${
                        activeCategory === "" ? "text-[#E29C15] font-semibold" : "text-[#2A190C] hover:text-[#E29C15]"
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="text-[#2A190C]/60">
                        ({String(blogs.length).padStart(2, "0")})
                      </span>
                    </button>
                  </motion.li>
                  {categories.map((cat) => (
                    <motion.li key={cat.label} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <button
                        onClick={() => {
                          setActiveCategory(cat.label);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between text-sm transition-colors ${
                          activeCategory === cat.label
                            ? "text-[#E29C15] font-semibold"
                            : "text-[#2A190C] hover:text-[#E29C15]"
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="text-[#2A190C]/60">
                          ({String(cat.count).padStart(2, "0")})
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* Table of Content — titles of the 3 articles on the current page */}
            <motion.div variants={fadeInLeft} className="rounded-lg border border-[#E29C15] px-5 py-5 text-left">
              <h3 className="font-serif text-xl text-[#5B2D07] mb-1">Table of Content</h3>
              <div className="w-10 h-[2px] bg-[#E29C15] mb-4" />
              {pageItems.length === 0 ? (
                <p className="text-sm text-[#2A190C]/60">No articles on this page.</p>
              ) : (
                <ol className="space-y-2">
                  {pageItems.map((article, i) => (
                    <motion.li
                      key={article._id}
                      className="text-sm text-[#2A190C]"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => navigate(`/blog-view/${article._id}`)}
                        className="text-left hover:text-[#E29C15] transition-colors"
                      >
                        {i + 1}. {article.title}
                      </button>
                    </motion.li>
                  ))}
                </ol>
              )}
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}