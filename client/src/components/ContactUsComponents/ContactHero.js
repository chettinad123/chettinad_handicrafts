import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Img from "../../assets/ContactImages/Banner.webp";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const subVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.15 },
  },
};

/**
 * Contact Us page hero / banner.
 *
 * Props:
 * - bgImage: string (background image url/import)
 * - title: string      e.g. "Contact Us"
 * - subtitle: string   e.g. "Your Trusted Craftmanship Partner"
 */
export default function ContactHero({
  bgImage = `${Img}`,
  title = "Contact Us",
  subtitle = "Your Trusted Craftmanship Partner",
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] overflow-hidden"
    >
      {/* Background image */}
      <img
        src={bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-[#00000033]" />

      {/* Content */}
      <div className="relative z-10 h-full w-full max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10 flex flex-col items-center justify-center text-center">
        <motion.h1
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={titleVariants}
          className="font-serif text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-white"
        >
          {title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={subVariants}
          className="mt-3 sm:mt-4 font-serif text-sm sm:text-base md:text-lg lg:text-xl text-white/90"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}