import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

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

const steps = [
  {
    number: "01",
    title: "Share Requirement",
    desc: "Tell us your ideas, measurements, and project requirements.",
  },
  {
    number: "02",
    title: "Reference & Consultation",
    desc: "Share your preferred design, discuss materials, and finalize your budget with our experts.",
  },
  {
    number: "03",
    title: "Crafting Begins",
    desc: "Our skilled artisans carefully handcraft every detail using premium materials and traditional techniques.",
  },
  {
    number: "04",
    title: "Safe Delivery & Support",
    desc: "Your custom creation is delivered with care, ensuring quality from our workshop to your space.",
  },
];

export default function OrderProcess() {
  const sectionRef = useRef(null);
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
          Custom Order Process
        </motion.span>

        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="mt-3 text-center font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-regular text-[#5B2D07]"
        >
          Simple Steps to Your Dream Creation
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14"
        >
          {steps.map(({ number, title, desc }) => (
            <motion.div
              key={number}
              variants={cardVariants}
              className="relative pt-8"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#F5E6CA] border border-[#E29C15] flex items-center justify-center">
                <span className="w-12 h-12 rounded-full bg-[#E29C15] text-white flex items-center justify-center font-semibold text-lg">
                  {number}
                </span>
              </div>
              <div className="h-full rounded-xl border border-[#E29C15] bg-[#F5E6CA] pt-12 pb-8 px-6 text-center">
                <h3 className="font-serif text-lg sm:text-xl text-[#5B2D07]">
                  {title}
                </h3>
                <p className="mt-3 text-sm text-[#2A190C]">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}