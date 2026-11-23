import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Masonry from "react-masonry-css";
import api from "../../common/apiClient"; // adjust path
import summaryApi from "../../common/SummaryApi"; // adjust path

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const imageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/**
 * One category block: a title followed by an image grid (masonry).
 */
function WorksCategory({ title, images }) {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  const breakpointColumns = {
    default: 4,
    1024: 3,
    768: 2,
    640: 2,
  };

  return (
    <div className="mt-12 first:mt-0">
      <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-regular text-[#5B2D07]">
        {title}
      </h3>

      <motion.div
        ref={gridRef}
        initial="hidden"
        animate={gridInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="mt-5"
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {images.map((img, i) => (
            <motion.div key={i} variants={imageVariants} className="mb-4">
              <motion.img
                src={img}
                alt={`${title} ${i + 1}`}
                className="w-full h-auto rounded"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          ))}
        </Masonry>
      </motion.div>
    </div>
  );
}

// Group flat gallery items into { title, images[] } per category
function groupByCategory(items) {
  const map = new Map();
  for (const item of items) {
    const categoryId = item.category?._id;
    const categoryTitle = item.category?.name || "Category";

    if (!map.has(categoryId)) {
      map.set(categoryId, { title: categoryTitle, images: [] });
    }
    map.get(categoryId).images.push(item.imageUrl);
  }
  return Array.from(map.values());
}

/**
 * Gallery "Discover Our Finest Creations" section — images pulled from backend,
 * grouped by category, masonry layout per category.
 */
export default function OurWorks() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eyebrow = "Our Work Speaks";
  const heading = "Explore Our Finest Handcrafted Creations";

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api({
          url: summaryApi.getGallery.url,
          method: summaryApi.getGallery.method,
          params: { paginate: false },
        });

        const raw = res.data?.data?.images ?? [];
        const activeItems = raw.filter((item) => item.status === "active");
        const grouped = groupByCategory(activeItems);

        if (isMounted) setCategories(grouped);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        if (isMounted) setError("Unable to load gallery right now. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="text-center"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#E29C15]">
            {eyebrow}
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl font-regular text-[#5B2D07]">
            {heading}
          </h2>
        </motion.div>

        <div className="mt-10">
          {loading && (
            <p className="text-center text-sm text-[#2A190C]">Loading gallery…</p>
          )}
          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && categories.length === 0 && (
            <p className="text-center text-sm text-[#2A190C]">No works to display yet.</p>
          )}
          {!loading &&
            !error &&
            categories.map((category, i) => (
              <WorksCategory key={category.title + i} {...category} />
            ))}
        </div>
      </div>
    </section>
  );
}