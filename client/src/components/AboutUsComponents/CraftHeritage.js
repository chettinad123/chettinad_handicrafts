import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Import your images (adjust paths as needed)
import authenticDesignImg from "../../assets/AboutPageImages/Craft1.webp"; // Replace with your actual image path
import craftsmanshipImg from "../../assets/AboutPageImages/Craft2.webp"; // Replace with your actual image path
import qualityMaterialsImg from "../../assets/AboutPageImages/Craft1.webp";// Replace with your actual image path

// Matches AboutHero.jsx visual language:
// - bg-[#F7F2E8], thin #E29C15 border wrapping the whole section
// - font-serif heading in #5B2D07, #2A190C body copy
// - #E29C15 outlined cards with line-art icons

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

const features = [
  { image: authenticDesignImg, title: "Authentic Chettinad Designs", alt: "Authentic Chettinad Design" },
  { image: craftsmanshipImg, title: "Traditional Craftmanship", alt: "Traditional Craftsmanship" },
  { image: qualityMaterialsImg, title: "Premium Quality Materials", alt: "Premium Quality Materials" },
];

export default function CraftHeritage() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section id="journey" className="w-full bg-[#F7F2E8] border border-[#E29C15] rounded px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
      <div
        ref={sectionRef}
        className="mx-auto max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] px-6 sm:px-10 lg:px-16 py-10 sm:py-14"
      >
        <motion.div
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-regular text-[#5B2D07]"
          >
            Chettinad Craft Heritage
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-sm sm:text-base text-[#2A190C] max-w-3xl mx-auto"
          >
            Chettinad craftsmanship is known for its elegance, strength, and
            intricate detailing. At Chettinad Handicrafts, we proudly continue
            this rich tradition by blending age-old techniques with premium
            materials and modern customization. Every piece is handcrafted by
            skilled artisans, ensuring that each creation carries the true
            essence of Chettinad heritage.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6">
            {features.map(({ image, title, alt }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="flex flex-col items-center justify-center gap-4 border border-[#E29C15] rounded-lg px-6 py-8"
              >
                <img 
                  src={image} 
                  alt={alt}
                  className="w-16 h-16"
                />
                <p className="font-serif text-base sm:text-lg text-[#5B2D07] text-center leading-snug">
                  {title}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}