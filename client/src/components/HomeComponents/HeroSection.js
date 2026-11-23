import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import heroImg from "../../assets/HomePageImages/Banner.webp";
// 👇 add your background image asset here
import heroBg from "../../assets/HomePageImages/BgImage.webp";
import Img1 from "../../assets/HomePageImages/Stat1.webp";
import Img2 from "../../assets/HomePageImages/Stat2.webp";
import Img3 from "../../assets/HomePageImages/Stat3.webp";
import Img4 from "../../assets/HomePageImages/Stat4.webp";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const leftVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const eyebrowVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
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
  { image: Img1, label: "SINCE 1986", desc: "Crafting Heritage" },
  { image: Img2, label: "40+ Years", desc: "Trusted Craftsmanship" },
  { image: Img3, label: "PREMIUM", desc: "Timeless Creations" },
  { image: Img4, label: "PAN INDIA", desc: "Delivering Excellence" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
    margin: "-100px 0px -100px 0px",
  });

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="
    relative w-full bg-[#F7F2E8] overflow-hidden
    lg:min-h-[650px]
    2xl:min-h-[720px]
    min-[2560px]:min-h-[900px]
    min-[3840px]:min-h-[1100px]
  "
    >
      {/* Background image — lg screens only */}
      <div
        className="hidden lg:block absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Hero with text on the left, image on the right */}
      <div className="relative z-10 flex items-center h-full">
        <div
          className="
    relative z-10
    w-full
    max-w-[1500px]
    md:max-w-[768px]
    lg:max-w-[1024px]
    xl:max-w-[1220px]
    2xl:max-w-[1500px]
    mx-auto
    px-6 sm:px-10 lg:px-4 xl:px-10
    py-16
    min-h-[650px]
    2xl:min-h-[720px]
    min-[2560px]:min-h-[900px]
    min-[3840px]:min-h-[1100px]
    flex items-center
  "
        >
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left: text content */}
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0 lg:w-1/2"
            >
              <motion.span
                variants={eyebrowVariants}
                className="text-xs sm:text-sm font-semibold tracking-wide text-[#E29C15]"
              >
                Heritage. Craftmanship. Quality
              </motion.span>

              <motion.h1
                variants={leftVariants}
                className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-wide uppercase text-[#5B2D07]"
              >
                Traditional Craftsmanship. Timeless Heritage
              </motion.h1>

              <motion.p
                variants={leftVariants}
                className="mt-5 text-sm sm:text-base text-[#2A190C] max-w-xl mx-auto lg:mx-0"
              >
                Preserving the legacy of Chettinad craftsmanship since 1986
                through handcrafted wood, stone, and traditional art creations.
                <br />
                Crafted by Tradition. Built to Last.
              </motion.p>

              <motion.div
                variants={leftVariants}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
              >
                <button
                  onClick={() => navigate("/enquiry")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-3.5 text-sm font-semibold text-white"
                >
                  Enquiry
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/gallery")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-lg border border-[#E29C15] hover:bg-white/40 transition-colors px-6 py-3.5 text-sm font-semibold text-[#5C3317]"
                >
                  View Gallery
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right: hero image — hidden on lg and up only */}
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={imageVariants}
              className="w-full lg:w-1/2 lg:hidden"
            >
              <img
                src={heroImg}
                alt="Hand-carved wooden pillars and door"
                className="w-full h-[280px] sm:h-[360px] md:h-[460px] lg:h-[600px] object-contain"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative z-10 w-full bg-white"
      >
        <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 px-6 sm:px-10 py-10">
          {stats.map(({ image, label, desc }, i) => (
            <motion.div
              key={label}
              variants={statVariants}
              className={`relative flex items-center gap-3 justify-center sm:justify-start pl-4 sm:pl-6 ${
                i !== 0
                  ? "sm:before:content-[''] sm:before:absolute sm:before:left-0 sm:before:top-1/2 sm:before:-translate-y-1/2 sm:before:h-10 sm:before:w-px sm:before:bg-[#EAD9AE]"
                  : ""
              }`}
            >
              <img
                src={image}
                alt={label}
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <div className="text-left">
                <p className="font-serif whitespace-nowrap text-sm sm:text-base font-bold tracking-wide uppercase text-[#0B1A35]">
                  {label}
                </p>
                <p className="text-xs sm:text-sm text-[#0B1A35]">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
