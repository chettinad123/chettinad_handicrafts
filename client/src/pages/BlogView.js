import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { motion, useAnimation, useInView } from "framer-motion";
import api from "../common/apiClient";
import SummaryApi from "../common/SummaryApi";

const shareLinks = [
  {
    icon: FaFacebook,
    href: "https://facebook.com",
    label: "Share on Facebook",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com",
    label: "Share on Instagram",
  },
  { icon: FaYoutube, href: "https://youtube.com", label: "Share on YouTube" },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};
const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/* ─── Rich text sanitizer ──────────────────────────────────────────────
 * Paragraph / list item / Pro Tip fields are allowed to carry bold,
 * italic, underline and line breaks (produced by the blog editor).
 * This whitelists exactly those tags and strips everything else before
 * the HTML is rendered with dangerouslySetInnerHTML, so formatting
 * shows up correctly instead of as literal <b>/<i>/<u> text.
 * ──────────────────────────────────────────────────────────────────── */
const RICH_TEXT_ALLOWED_TAGS = new Set([
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "BR",
  "A",
]);

const sanitizeRichText = (html) => {
  if (!html || typeof html !== "string") return "";

  const container = document.createElement("div");
  container.innerHTML = html;

  const clean = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) return; // plain text — keep
      if (child.nodeType !== 1) {
        node.removeChild(child);
        return;
      }

      if (!RICH_TEXT_ALLOWED_TAGS.has(child.tagName)) {
        while (child.firstChild) node.insertBefore(child.firstChild, child);
        node.removeChild(child);
      } else if (child.tagName === "A") {
        // Keep only href; regenerate target/rel safely.
        const href = child.getAttribute("href") || "";
        [...child.attributes].forEach((attr) =>
          child.removeAttribute(attr.name),
        );
        if (href) {
          child.setAttribute("href", href);
          child.setAttribute("target", "_blank");
          child.setAttribute("rel", "noopener noreferrer");
          clean(child);
        } else {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          node.removeChild(child);
        }
      } else {
        [...child.attributes].forEach((attr) =>
          child.removeAttribute(attr.name),
        );
        clean(child);
      }
    });
  };

  clean(container);
  return container.innerHTML;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const estimateReadTime = (content) => {
  if (!Array.isArray(content)) return "1 Min Read";
  const wordCount = content
    .filter((b) => b.type === "text" || b.type === "quote")
    .reduce((acc, b) => acc + (b.text ? b.text.split(/\s+/).length : 0), 0);
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} Min${minutes > 1 ? "s" : ""} Read`;
};

// ---------- Content block renderer ----------
const headingSizeMap = {
  h1: "text-2xl sm:text-3xl",
  h2: "text-lg sm:text-xl",
  h3: "text-base sm:text-lg",
  h4: "text-sm sm:text-base",
};

const renderBlock = (block, idx) => {
  switch (block.type) {
    case "heading": {
      const Tag = block.level || "h2";
      return (
        <motion.div key={idx} variants={fadeInUp}>
          <Tag
            className={`font-serif ${headingSizeMap[block.level] || headingSizeMap.h2} text-[#5B2D07]`}
          >
            {block.text}
          </Tag>
        </motion.div>
      );
    }

    case "text":
      return (
        <motion.p
          key={idx}
          variants={fadeInUp}
          className="text-sm sm:text-base text-[#2A190C] leading-relaxed [&_a]:text-[#E29C15] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#C98B24]"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(block.text) }}
        />
      );

    case "list":
      return block.style === "number" ? (
        <motion.ol
          key={idx}
          variants={staggerContainer}
          className="list-decimal list-inside space-y-1.5"
        >
          {block.items?.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              className="text-sm sm:text-base text-[#2A190C] leading-relaxed [&_a]:text-[#E29C15] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#C98B24]"
              whileHover={{ x: 8 }}
              transition={{ duration: 0.2 }}
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(item) }}
            />
          ))}
        </motion.ol>
      ) : (
        <motion.ul
          key={idx}
          variants={staggerContainer}
          className="space-y-1.5"
        >
          {block.items?.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              className="text-sm sm:text-base text-[#2A190C] leading-relaxed"
              whileHover={{ x: 8 }}
              transition={{ duration: 0.2 }}
            >
              -{" "}
              <span
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(item) }}
              />
            </motion.li>
          ))}
        </motion.ul>
      );

    case "image":
      return (
        <motion.img
          key={idx}
          variants={imageVariants}
          src={block.imageurl?.url}
          alt={block.text || "Blog image"}
          className="w-full rounded-lg object-cover max-h-[420px]"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
        />
      );

    case "quote":
      return (
        <motion.blockquote
          key={idx}
          variants={fadeInUp}
          className="border-l-4 border-[#E29C15] pl-4 italic text-[#2A190C]/80 text-sm sm:text-base"
        >
          {block.text}
        </motion.blockquote>
      );

    case "code":
      return (
        <motion.pre
          key={idx}
          variants={fadeInUp}
          className="bg-[#2A190C] text-[#F7F2E8] rounded-lg p-4 text-xs sm:text-sm overflow-x-auto"
        >
          <code>{block.text}</code>
        </motion.pre>
      );

    case "link":
      return (
        <motion.a
          key={idx}
          variants={fadeInUp}
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E29C15] underline text-sm sm:text-base block"
        >
          {block.text}
        </motion.a>
      );

    case "proTip":
      return (
        <motion.div
          key={idx}
          variants={fadeInUp}
          className="rounded-lg bg-[#E29C15]/10 border border-[#E29C15]/40 px-4 py-3"
        >
          <p className="text-xs font-semibold text-[#E29C15] mb-1">Pro Tip</p>
          <p
            className="text-sm text-[#2A190C] [&_a]:text-[#5B2D07] [&_a]:font-semibold [&_a]:underline [&_a]:decoration-[#E29C15] [&_a]:decoration-2 hover:[&_a]:text-[#E29C15]"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(block.text) }}
          />
        </motion.div>
      );
    case "button":
      return (
        <motion.a
          key={idx}
          variants={fadeInUp}
          href={block.href}
          target={block.buttonTarget || "_self"}
          rel={
            block.buttonTarget === "_blank" ? "noopener noreferrer" : undefined
          }
          className="inline-block rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-2.5 text-sm font-semibold text-white"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {block.text}
        </motion.a>
      );

    default:
      return null;
  }
};

/* ─────────────────────────────────────────────────────────
   Inner component: holds ALL scroll-animation logic.
   Mounting this fresh (via key={id} on the parent) guarantees
   useInView's IntersectionObserver re-attaches correctly on
   every blog navigation, even when the route just swaps :id.
───────────────────────────────────────────────────────── */
function BlogContent({ blog }) {
  const headerRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  const headerControls = useAnimation();
  const heroControls = useAnimation();
  const contentControls = useAnimation();

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (headerInView) headerControls.start("visible");
  }, [headerInView, headerControls]);
  useEffect(() => {
    if (heroInView) heroControls.start("visible");
  }, [heroInView, heroControls]);
  useEffect(() => {
    if (contentInView) contentControls.start("visible");
  }, [contentInView, contentControls]);

  return (
    <section className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        {/* Title + meta */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerControls}
          variants={fadeInLeft}
          className="text-left"
        >
          <motion.h1
            className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5B2D07] leading-tight"
            variants={fadeInUp}
          >
            {blog.title}
          </motion.h1>

          <motion.div
            className="mt-4 flex items-center justify-between flex-wrap gap-3"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-4 text-xs sm:text-sm text-[#2A190C]/70">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 text-[#E29C15] h-4" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E29C15]" />
                {estimateReadTime(blog.content)}
              </span>
            </div>

            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs sm:text-sm font-semibold text-[#E29C15]">
                Share :
              </span>
              {shareLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#E29C15] hover:text-[#C98B24] transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero image */}
        {blog.heroimage?.url && (
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroControls}
            variants={imageVariants}
            className="mt-6 w-full overflow-hidden rounded"
          >
            <motion.img
              src={blog.heroimage.url}
              alt={blog.title}
              className="w-full h-64 sm:h-80 lg:h-[420px] object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}

        {/* Article body */}
        <motion.div
          ref={contentRef}
          initial="hidden"
          animate={contentControls}
          variants={staggerContainer}
          className="mt-10 space-y-6 text-left"
        >
          {blog.content?.map((block, idx) => renderBlock(block, idx))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Outer component: handles routing/data-fetching only.
   key={id} on <BlogContent> forces a full remount whenever
   the :id param changes, so refs/observers are always fresh.
───────────────────────────────────────────────────────── */
export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const { url, method } = SummaryApi.getBlogsById;
      const res = await api({ url: url.replace(":id", id), method });
      setBlog(res.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load this article.");
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <section className="w-full bg-[#F7F2E8] py-24 text-center text-sm text-[#2A190C80]">
        Loading article...
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="w-full bg-[#F7F2E8] py-24 text-center">
        <p className="text-sm text-red-600 mb-4">
          {error || "Article not found."}
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="text-sm font-semibold text-[#E29C15] underline"
        >
          Back to Articles
        </button>
      </section>
    );
  }

  return <BlogContent key={id} blog={blog} />;
}
