import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import woodImg from "../../assets/HomePageImages/Experience1.webp";
import stoneImg from "../../assets/HomePageImages/Experience2.webp";
import artImg from "../../assets/HomePageImages/Experience3.webp";

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

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const experiences = [
  {
    img: woodImg,
    title: "Wood Works",
    desc: "Handcrafted wooden doors, pillars, furniture, and custom wood creations crafted from premium-quality Teak, Rose, Satin, Jack, Vengai, and Vembu wood to complement every space.",
  },
  {
    img: stoneImg,
    title: "Stone Works",
    desc: "Original granite stone pillars and traditional stone works, handcrafted by skilled artisans to deliver unmatched strength, timeless beauty, and lasting value for generations.",
  },
  {
    img: artImg,
    title: "Traditional Art Works",
    desc: "Authentic Tanjore paintings, custom artworks, and restoration services crafted with traditional techniques to preserve cultural heritage and artistic excellence.",
  },
];

export default function OurExperience() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
    margin: "-100px 0px -100px 0px",
  });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F7F2E8] py-16 overflow-hidden"
    >
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.span
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={eyebrowVariants}
          className="block text-center text-xs sm:text-sm font-medium tracking-wide text-[#E29C15]"
        >
          Our Experience
        </motion.span>

        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="mt-3 text-center font-serif text-3xl sm:text-3xl md:text-4xl lg:5xl font-regular text-[#5B2D07]"
        >
          What We Create
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {experiences.map(({ img, title, desc }, index) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className={`bg-[#FDFBF7] rounded-xl overflow-hidden shadow-sm border border-[#F0E6D2] flex flex-col ${
                index === 2
                  ? "sm:col-start-1 sm:col-end-3 lg:col-start-auto lg:col-end-auto"
                  : ""
              } ${index === 2 ? "sm:mx-auto sm:w-1/2 lg:w-full" : ""}`}
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col items-center text-center flex-1">
                <h3 className="font-serif text-xl text-[#5B2D07]">{title}</h3>
                <p className="mt-3 text-sm text-[#2A190C]">{desc}</p>
                <button
                  onClick={() =>
                    navigate("/enquiry#enquiry-form", {
                      state: { subject: title },
                    })
                  }
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#E29C15] hover:text-[#C98B24] transition-colors bg-none border-none cursor-pointer p-0"
                >
                  Enquiry
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
