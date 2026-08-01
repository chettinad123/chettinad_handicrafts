import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Import your images (adjust paths as needed)
import missionImg from "../../assets/AboutPageImages/Mission.webp"; // Replace with your actual image path
import visionImg from "../../assets/AboutPageImages/Vision.webp"; // Replace with your actual image path

// Matches AboutHero.jsx visual language:
// - bg-[#F7F2E8], thin #E29C15 border wrapping the whole section
// - font-serif heading in #5B2D07 / #E29C15 sub-labels, #2A190C body copy

const fadeUp = {
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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const items = [
  {
    image: missionImg,
    alt: "Mission Icon",
    label: "Mission",
    text: "To preserve and promote the rich heritage of Chettinad craftsmanship by creating premium handcrafted wood, stone, and traditional art creations with uncompromising quality, authenticity, and customer satisfaction.",
  },
  {
    image: visionImg,
    alt: "Vision Icon",
    label: "Vission",
    text: "To become India's most trusted heritage craftsmanship brand, bringing the timeless beauty of Chettinad architecture and handcrafted creations to homes and spaces across the world.",
  },
];

export default function MissionAndVision() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section className="w-full bg-[#F7F2E8] border border-[#E29C15] rounded px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
      <div
        ref={sectionRef}
        className="mx-auto max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] px-6 sm:px-10 lg:px-16 py-10 sm:py-14"
      >
        <motion.div
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2
            variants={fadeUp}
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-regular text-[#5B2D07] text-center"
          >
            Mission & Vission
          </motion.h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-8 lg:gap-16">
            {items.map(({ image, alt, label, text }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
              >
                <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
                  <img 
                    src={image} 
                    alt={alt}
                    className="w-12 h-12"
                  />
                </span>
                <div>
                  <p className="font-serif text-lg sm:text-xl text-[#E29C15]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm sm:text-base text-[#2A190C]">
                    {text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}