import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

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

const testimonials = [
  {
    quote:
      "Exceptional craftsmanship and premium quality. The handcrafted wooden door transformed our home beautifully. Highly recommended.",
    name: "Ramesh Kumar",
    location: "Chennai",
  },
  {
    quote:
      "The granite pillars were crafted with incredible precision. The finish, quality, and attention to detail exceeded our expectations",
    name: "Lakshmi Priya",
    location: "Coimbatore",
  },
  {
    quote:
      "Professional team, customized designs, and excellent workmanship. Truly authentic Chettinad craftsmanship.",
    name: "Suresh Babu",
    location: "Bengaluru",
  },
];

export default function ClientTestimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
    margin: "-100px 0px -100px 0px",
  });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F7F2E8] pb-16 overflow-hidden"
    >
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.span
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={eyebrowVariants}
          className="block text-center text-xs sm:text-sm font-medium tracking-wide text-[#E29C15]"
        >
          Client Testimonials
        </motion.span>

        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="mt-3 text-center font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-regular text-[#5B2D07]"
        >
          What Our Clients Says
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map(({ quote, name, location }, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="rounded-xl border border-[#E29C15] bg-[#FDFBF7] p-6 sm:p-7 flex flex-col"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-[#D4AF37] text-[#D9A441]"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm sm:text-base text-[#2A190C] flex-1">
                "{quote}"
              </p>
              <p className="mt-6 text-sm font-regular text-[#2A190C] text-right">
                - {name}, {location}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}