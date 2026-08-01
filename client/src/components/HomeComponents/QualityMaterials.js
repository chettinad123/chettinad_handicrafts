import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import teakImg from "../../assets/HomePageImages/Material1.webp";
import jackImg from "../../assets/HomePageImages/Material2.webp";
import vembuImg from "../../assets/HomePageImages/Material3.webp";
import vengaiImg from "../../assets/HomePageImages/Material4.webp";
import graniteImg from "../../assets/HomePageImages/Material5.webp";
import oldStoneImg from "../../assets/HomePageImages/Material6.webp";

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
    transition: { staggerChildren: 0.1, delayChildren: 0.25 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const materials = [
  { img: teakImg, name: "Teak Wood" },
  { img: jackImg, name: "Jack Wood" },
  { img: vembuImg, name: "Vembu Wood" },
  { img: vengaiImg, name: "Vengai Wood" },
  { img: graniteImg, name: "Granite Stone" },
  { img: oldStoneImg, name: "Old Stone" },
];

export default function QualityMaterials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
    margin: "-100px 0px -100px 0px",
  });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F8F3E8] pb-16 overflow-hidden"
    >
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.span
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={eyebrowVariants}
          className="block text-center text-xs sm:text-sm font-medium tracking-wide text-[#E29C15]"
        >
          Premium Quality Materials
        </motion.span>

        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="mt-3 text-center font-serif text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-regular text-[#5B2D07]"
        >
          Finest Materials, Timeless Creations.
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {materials.map(({ img, name }) => (
            <motion.div
              key={name}
              variants={cardVariants}
              className="bg-[#FDFBF7] rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="py-3 text-center font-serif text-sm sm:text-base text-[#5B2D07]">
                {name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}