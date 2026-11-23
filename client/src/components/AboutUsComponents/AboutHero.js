import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import bannerImg from "../../assets/AboutPageImages/AboutBanner.webp";
import historyImg from "../../assets/AboutPageImages/CompanyHistory.webp";
import statsImg from "../../assets/AboutPageImages/StatsImg.webp";

// Uses the same serif display face as HeroSection ("Playfair Display").
// Make sure theme.extend.fontFamily.serif is configured in tailwind.config.js.

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

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stats = [
  { image: statsImg, label: "40+", desc: "Years Experience" },
  { image: statsImg, label: "1000+", desc: "Projects Completed" },
  { image: statsImg, label: "Original Granite", desc: "Premium Wood" },
  { image: statsImg, label: "Presence", desc: "Pan India" },
];

export default function AboutHero() {

  const bannerRef = useRef(null);
  const bannerInView = useInView(bannerRef, { once: true, amount: 0.2 });

  const historyRef = useRef(null);
  const historyInView = useInView(historyRef, { once: true, amount: 0.2 });

  return (
    <section className="w-full bg-[#F7F2E8] overflow-hidden">
      {/* Banner */}
      <div ref={bannerRef} className="relative">
        <div className="relative h-[280px] sm:h-[380px] lg:h-[460px] w-full">
          <img
            src={bannerImg}
            alt="Hand-carved wooden pillars and doorway"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#00000033]" />

          <motion.div
            initial="hidden"
            animate={bannerInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          >
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-white">
              About Us
            </h1>
            <p className="mt-3 font-serif text-sm sm:text-base lg:text-lg text-white">
              Crafted By Traditions.
              <br /> Perfected By Generations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats bar - positioned below banner on all screens */}
      <motion.div
        initial="hidden"
        animate={bannerInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative z-10 px-4 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] rounded bg-[#0B1A35] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 shadow-lg mt-6 sm:mt-8 lg:-mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
            {stats.map(({ image, label, desc }, i) => (
              <motion.div
                key={desc}
                variants={statVariants}
                className={`flex items-center gap-3 justify-start sm:justify-start relative ${
                  i === 0 || i === 1
                    ? "sm:border-b sm:border-[#F7F2E8]/20 sm:pb-6 lg:border-b-0 lg:pb-0"
                    : ""
                }`}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#28467C] overflow-hidden">
                  <img
                    src={image}
                    alt={label}
                    className="h-4 w-4 object-contain"
                  />
                </span>
                <div className="text-left">
                  <p className="font-serif text-sm sm:text-base font-bold text-[#E29C15]">
                    {label}
                  </p>
                  <p className="text-xs sm:text-sm text-white whitespace-nowrap">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Company history */}
      <div
        ref={historyRef}
        className="w-full max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10 py-16 sm:py-20"
      >
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: text */}
          <motion.div
            initial="hidden"
            animate={historyInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0 lg:w-1/2"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs sm:text-sm font-semibold tracking-wide text-[#E29C15]"
            >
              Company History
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-[#5B2D07]"
            >
              Since 1986
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm sm:text-base text-[#2A190C] max-w-xl mx-auto lg:mx-0"
            >
              Established in the heart of Karaikudi, Chettinad Handicrafts has
              been preserving the timeless legacy of Chettinad craftsmanship for
              over four decades. From handcrafted wooden doors and granite stone
              pillars to custom furniture and traditional Tanjore paintings,
              every creation reflects our dedication to quality, authenticity,
              and skilled craftsmanship. Today, our handcrafted works continue
              to enhance homes, villas, temples, and commercial spaces across
              India.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <button
                onClick={() => {
                  document.getElementById("journey")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E29C15] hover:bg-[#E29C15]/10 transition-colors px-6 py-3.5 text-sm font-semibold text-[#E29C15]"
              >
                Explore Our Journey
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right: image */}
<motion.div
  initial="hidden"
  animate={historyInView ? "visible" : "hidden"}
  variants={fadeUp}
  className="w-full lg:w-1/2"
>
  <img
    src={historyImg}
    alt="Hand-carved wooden figures and cabinet"
    className="w-full h-auto rounded object-cover"
  />
</motion.div>
        </div>
      </div>
    </section>
  );
}
