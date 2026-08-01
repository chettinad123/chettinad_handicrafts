import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Package, Users, Truck } from "lucide-react";

const eyebrowVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Default data — used only if no `items` prop is passed, so the component
// still renders something sensible out of the box.
const defaultItems = [
  {
    icon: Award,
    title: "40+ Years of Craftsmanship",
    desc: "Preserving the rich heritage of Chettinad craftsmanship with decades of experience and excellence.",
  },
  {
    icon: Package,
    title: "Premium Quality Materials",
    desc: "We carefully select premium wood and original granite to ensure durability, beauty, and lasting value.",
  },
  {
    icon: Users,
    title: "Custom-Made Creations",
    desc: "Every product is designed and handcrafted to match your style, space, and requirements.",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    desc: "Delivering handcrafted Chettinad creations safely to homes, villas, temples, and commercial projects across India.",
  },
];

// Static map so Tailwind can see the full class names at build time.
const GRID_COLS_MAP = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/**
 * Reusable "Why Choose Us" section.
 *
 * Props:
 * - eyebrow: string        small label above the heading (default "Why Choose Us")
 * - heading: string        main heading (default "Crafted with Trust, Build to Last")
 * - items: Array<{
 *     icon: React component  e.g. a lucide-react icon
 *     title: string,
 *     desc: string,
 *   }>                     defaults to the 4 items above if not provided
 */
export default function WhyChoose({
  eyebrow = "Why Choose Us",
  heading = "Crafted with Trust, Build to Last",
  items = defaultItems,
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
    margin: "-100px 0px -100px 0px",
  });

  const gridColsClass = GRID_COLS_MAP[Math.min(items.length, 5)] || GRID_COLS_MAP[4];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0B1A35] px-4 sm:px-6 lg:px-8 py-16 overflow-hidden"
    >
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto">
        <motion.span
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={eyebrowVariants}
          className="block text-center text-xs sm:text-sm font-medium tracking-wide text-white"
        >
          {eyebrow}
        </motion.span>

        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="mt-3 text-center font-serif text-2xl sm:text-3xl md:text-4xl font-regular text-white"
        >
          {heading}
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`mt-12 grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-y-12 lg:gap-y-0`}
        >
          {items.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className={`relative flex flex-col items-center text-center px-6 ${
                i !== 0 ? "lg:border-l lg:border-[#F7F2E8]" : ""
              }`}
            >
              <span className="flex items-center justify-center w-16 h-16 rounded-full border border-[#DFA13F] text-[#DFA13F]">
                <Icon className="w-6 h-6" />
              </span>
              <h3 className="mt-5 font-serif text-lg sm:text-xl text-white">
                {title}
              </h3>
              <p className="mt-3 text-sm text-[#FFFFFF] max-w-[240px]">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}