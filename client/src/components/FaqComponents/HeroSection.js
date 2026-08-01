import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import heroImg from "../../assets/FaqBanner.webp";

// NOTE: Replace `heroImg` with your actual courtyard/heritage photo.
// This section uses the same serif display face as the header/footer wordmarks:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

// Animation variants
// const containerVariants = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.8,
//       ease: "easeOut",
//     },
//   },
// };

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

// const subtitleVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut",
//       delay: 0.4,
//     },
//   },
// };

// const imageVariants = {
//   hidden: { scale: 1.1 },
//   visible: {
//     scale: 1,
//     transition: {
//       duration: 1.2,
//       ease: "easeOut",
//     },
//   },
// };

export default function HeroSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background image with animation */}
      <motion.img
        src={heroImg}
        alt="Custom Orders — Chettinad Handi Crafts"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-[#00000033]" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10 flex flex-col items-center justify-center text-center">
        <motion.h1
          className="font-serif font-semibold tracking-wide text-white text-3xl sm:text-4xl lg:text-5xl xl:text-5xl"
          variants={titleVariants}
        >
        FAQ's<br/><span className="uppercase">Frequently<br /> Asked Questions</span>
        </motion.h1>
      </div>
    </motion.section>
  );
}