import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import api from "../../common/apiClient"; // adjust path to your apiClient.js
import summaryApi from "../../common/SummaryApi"; // adjust path to your summaryApi.js

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// GRID_COLS_MAP removed (unused)

// Matches your confirmed API shape: { success, data: { images: [...] } }
function normalizeItem(raw) {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description,
    image: raw.imageUrl,
    categoryId: raw.category?._id,
    categoryTitle: raw.category?.name || "Category",
    categoryDescription: raw.category?.description || "",
    enquiryPath: "/enquiry",
  };
}

function groupByCategory(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.categoryId)) {
      map.set(item.categoryId, {
        bannerImage: item.image, // no separate banner field, use first item's image
        title: item.categoryTitle,
        description: item.categoryDescription,
        enquiryPath: item.enquiryPath,
        items: [],
      });
    }
    map.get(item.categoryId).items.push(item);
  }
  return Array.from(map.values());
}

function WorkCategory({ bannerImage, title, description, items, enquiryPath }) {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.15 });

  return (
    <section ref={sectionRef} className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-[#E29C15] bg-[#F5E6CA] p-5 sm:p-6"
        >
          <img
            src={bannerImage}
            alt={title}
            className="w-full sm:w-auto h-32 sm:h-24 md:h-28 object-contain rounded flex-shrink-0"
          />
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#5B2D07]">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm sm:text-base text-[#2A190C] max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </motion.div>

        {/* Fixed 4-column grid, regardless of item count */}
        <motion.div
          ref={cardsRef}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="w-full max-w-sm mx-auto bg-[#FDFBF7] rounded overflow-hidden shadow shadow-[#00000040] flex flex-col"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-72 lg:h-64 xl:h-72 object-fill"
              />
              <div className="p-4 sm:p-5 flex flex-col items-start flex-1">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#5B2D07]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#2A190C] flex-1">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center gap-3 w-full">
                  <button
                    onClick={() =>
                      navigate("/enquiry#enquiry-form", {
                        state: { subject: item.title || title },
                      })
                    }
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2 text-xs sm:text-sm font-semibold text-[#E29C15]"
                  >
                    Enquiry
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(item.orderPath || "/orders#order-form", {
                        state: { item },
                      })
                    }
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-green-900 hover:bg-green-900 hover:text-white transition-colors px-4 py-2 text-xs sm:text-sm font-semibold text-green-900"
                  >
                    Order
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function OurWorks() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api({
          url: summaryApi.getGallery.url,
          method: summaryApi.getGallery.method,
        });

        const raw = res.data?.data?.images ?? [];

        const normalized = raw
          .filter((item) => item.status === "active")
          .map(normalizeItem);

        const grouped = groupByCategory(normalized);

        if (isMounted) setCategories(grouped);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        if (isMounted)
          setError(
            "Unable to load our works right now. Please try again later.",
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full py-24 flex justify-center bg-[#F7F2E8]">
        <p className="text-[#5B2D07] font-serif text-lg">Loading our works…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-24 flex justify-center bg-[#F7F2E8]">
        <p className="text-red-600 font-serif text-lg">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full py-24 flex justify-center bg-[#F7F2E8]">
        <p className="text-[#5B2D07] font-serif text-lg">
          No works to display yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {categories.map((cat) => (
        <WorkCategory key={cat.title} {...cat} />
      ))}
    </>
  );
}
