import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import card1 from "../../assets/GalleryImages/Card1.webp";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
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

// Data lives inside the component.
const stats = [
  { icon: card1, value: "Premium Quality", label: "Original granite stone and carefully selected premium wood for every handcrafted creation." },
  { icon: card1, value: "100% Custom-Made", label: "Every design is tailored to your space, style, and requirements." },
  { icon: card1, value: "Pan India Delivery", label: "Safe, secure, and reliable delivery of handcrafted creations across India." },
  { icon: card1, value: "Trusted Craftsmanship", label: "40+ years of experience delivering timeless Chettinad craftsmanship with uncompromising quality." },
];

export default function StatsCard() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });

  return (
    <section className="w-full bg-[#F7F2E8] pb-14">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="rounded-xl border border-[#E29C15] bg-[#F5E6CA] px-6 sm:px-10 py-8"
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