import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
// Import your project images here
import p1 from "../../assets/GalleryImages/Project1.webp";
import p2 from "../../assets/GalleryImages/Project2.webp";
import p3 from "../../assets/GalleryImages/Project3.webp";
import p4 from "../../assets/GalleryImages/Project4.webp";
import card1 from "../../assets/GalleryImages/Card1.webp";
import card2 from "../../assets/GalleryImages/Card2.webp";
import card3 from "../../assets/GalleryImages/Card3.webp";
import card4 from "../../assets/GalleryImages/Card4.webp";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Default stats — used only if no `stats` prop is passed.
const defaultStats = [
  { icon: card1, value: "1000+", label: "Creations Delivered" },
  { icon: card2, value: "40+", label: "Years of Craftsmanship" },
  { icon: card3, value: "100%", label: "Custom-Made Projects" },
  { icon: card4, value: "Pan India", label: "Delivery & Support" },
];

// Default projects data
const defaultProjects = [
  {
    image: p1,
    title: "Chettinad Heritage Residence",
    tags: ["Wooden Doors", "Pillars"],
  },
  {
    image: p2,
    title: "Luxury Villa Entrance",
    tags: ["Original Granite", "Stone Pillars"],
  },
  {
    image: p3,
    title: "Traditional Temple Restoration",
    tags: ["Stone Carvings", " Heritage Works"],
  },
  {
    image: p4,
    title: "Custom Home Interiors",
    tags: ["Wood Works", "Bespoke Furniture"],
  },
  {
    image: p4,
    title: "Authentic Tanjore Paintings",
    tags: ["New Creations", "Restoration Works"],
  },
];

/**
 * Featured Projects section — project showcase grid + a stats bar underneath.
 *
 * Props:
 * - eyebrow: string        e.g. "Featured Projects"
 * - heading: string        e.g. "Complete Project Showcases"
 * - projects: Array<{
 *     image: string,
 *     title: string,       e.g. "Chettinad Heritage Home"
 *     tags: string[],      e.g. ["Wood Works", "Interiors"] — joined with " . "
 *   }>
 * - stats: Array<{ icon: React component, value: string, label: string }>
 */
export default function FeaturedProject({
  eyebrow = "Featured Projects",
  heading = "A Showcase of Timeless Craftsmanship",
  projects = defaultProjects,
  stats = defaultStats,
}) {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.15 });

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });

  return (
    <section className="w-full bg-[#F7F2E8] py-14 sm:py-20">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="text-center"
        >
          <span className="text-xs sm:text-sm font-medium tracking-wide text-[#E29C15]">
            {eyebrow}
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl font-regular text-[#5B2D07]">
            {heading}
          </h2>
        </motion.div>

        {/* Project cards - 5 cards in single row on laptop/desktop */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.title + i}
              variants={cardVariants}
              className="bg-[#FDFBF7] rounded overflow-hidden shadow shadow-[#00000040]"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 sm:h-44 md:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-serif text-sm sm:text-base font-regular text-[#5B2D07]">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#2A190C]">
                  {project.tags?.map((tag, index) => (
                    <React.Fragment key={index}>
                      {tag}
                      {index < project.tags.length - 1 && (
                        <span className="text-[#E29C15]"> ● </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats bar - one by one on mobile */}
        <motion.div
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-10 rounded-xl border border-[#E29C15] bg-[#F5E6CA] px-6 sm:px-10 py-8"
        >
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                variants={statVariants}
                className="flex items-center gap-4"
              >
                <span className="flex items-center justify-center w-12 h-12 text-[#DFA13F] flex-shrink-0 overflow-hidden">
                  <img
                    src={Icon}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                </span>
                <div className="flex flex-col text-left">
                  <p className="font-serif text-lg sm:text-xl font-semibold text-[#5B2D07]">
                    {value}
                  </p>
                  <p className="text-xs sm:text-sm text-[#2A190C]">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}