import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Img1 from "../../assets/HomePageImages/Material1.webp";
import Img2 from "../../assets/HomePageImages/Material2.webp";
import Img3 from "../../assets/HomePageImages/Material3.webp";
import Img4 from "../../assets/HomePageImages/Material4.webp";
import Img5 from "../../assets/HomePageImages/Material5.webp";
import Img6 from "../../assets/HomePageImages/Material6.webp";

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
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Materials Used grid section.
 *
 * Props:
 * - title: string                    section heading, defaults to "Materials Used"
 * - materials: Array<{
 *     image: string,
 *     name: string,
 *     description: string,
 *   }>
 */




const defaultMaterials = [
  {
    image: Img1,
    name: "Teak Wood",
    description: "Durable hardwood with timeless elegance.",
  },
  {
    image: Img2,
    name: "Jack Wood",
    description: "Ideal for carvings and handcrafted doors.",
  },
  {
    image: Img3,
    name: "Vembu Wood",
    description: "Strong wood with traditional appeal.",
  },
  {
    image: Img4,
    name: "Vengai Wood",
    description: "Heavy-duty hardwood built to last.",
  },
  {
    image: Img5,
    name: "Granite Stone",
    description: "Premium natural stone with high durability.",
  },
  {
    image: Img6,
    name: "Old Stone",
    description: "Traditional stone for heritage-style designs.",
  },
];

export default function MaterialsUsed({ title = "Materials Used", materials = defaultMaterials }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section ref={sectionRef} className="w-full bg-[#F7F2E8] pb-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={titleVariants}
          className="text-center font-serif text-2xl sm:text-3xl md:text-4xl font-regular text-[#5B2D07]"
        >
          {title}
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {materials.map((m, i) => (
            <motion.div
              key={m.name + i}
              variants={cardVariants}
              className="bg-[#FDFBF7] rounded-xl overflow-hidden border border-[#00000040] flex flex-col"
            >
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-24 sm:h-28 md:h-32 object-cover"
              />
              <div className="p-3 sm:p-4">
                <p className="font-serif text-sm sm:text-base font-semibold text-[#5B2D07]">
                  {m.name}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#2A190C]">
                  {m.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}