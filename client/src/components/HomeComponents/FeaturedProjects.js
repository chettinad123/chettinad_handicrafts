import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../common/apiClient"; // adjust path to your apiClient.js
import summaryApi from "../../common/SummaryApi"; // adjust path to your summaryApi.js

const eyebrowVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.6 } },
};

export default function FeaturedProjects() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
    margin: "-100px 0px -100px 0px",
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const featured = raw
          .filter((item) => item.status === "active")
          .slice(0, 4)
          .map((item) => ({
            img: item.imageUrl,
            alt: item.title || "Featured project",
          }));

        if (isMounted) setProjects(featured);
      } catch (err) {
        console.error("Failed to load featured projects:", err);
        if (isMounted) setProjects([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F7F2E8] pb-16 overflow-hidden"
    >
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.span
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={eyebrowVariants}
          className="block text-center text-xs sm:text-sm font-medium tracking-wide text-[#E29C15]"
        >
          Featured Projects
        </motion.span>

        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="mt-3 text-center font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-regular text-[#5B2D07]"
        >
          Our Recent Creations
        </motion.h2>

        {loading ? (
          <p className="mt-12 text-center text-sm text-[#2A190C]">Loading projects…</p>
        ) : projects.length === 0 ? (
          <p className="mt-12 text-center text-sm text-[#2A190C]">No projects to display yet.</p>
        ) : (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {projects.map(({ img, alt }, i) => (
              <motion.div
                key={alt + i}
                variants={cardVariants}
                className="rounded-2xl overflow-hidden aspect-[3/4]"
              >
                <img
                  src={img}
                  alt={alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={buttonVariants}
          className="mt-10 flex justify-center"
        >
          <button
            onClick={() => navigate("/gallery")}
            className="inline-flex items-center justify-center rounded-lg bg-[#0E1B32] hover:bg-[#16294A] transition-colors px-8 py-3.5 text-sm font-semibold text-white"
          >
            View Gallery
          </button>
        </motion.div>
      </div>
    </section>
  );
}