import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import carvedImg from "../../assets/HomePageImages/CtaImage.webp";

const bannerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HomeCTA() {
  const Navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
    margin: "-100px 0px -100px 0px",
  });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F8F3E8] pb-16 overflow-hidden"
    >
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={bannerVariants}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Base layer: carved wood image, full bleed */}
          <img
            src={carvedImg}
            alt="Hand-carved wooden panel detail"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Navy overlay on the right two-thirds */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0E1B32]/70 to-[#0E1B32]" />

          <motion.div
            variants={containerVariants}
            className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-12 py-14 sm:py-16 min-h-[220px]"
          >
            <div className="text-center sm:text-left sm:ml-[35%] lg:ml-[38%]">
              <motion.h2
                variants={textVariants}
                className="font-serif text-2xl sm:text-3xl md:text-3xl text-white"
              >
                Ready to Start Your Custom Projects?
              </motion.h2>
              <motion.p
                variants={textVariants}
                className="mt-2 text-sm sm:text-base text-[#FFFFFF]"
              >
                Let's bring your vision to life with handcrafted excellence inspired by the timeless heritage of Chettinad.
              </motion.p>
            </div>

            <motion.button
              variants={textVariants}
              onClick={() => Navigate("/enquiry")}
              className="flex-shrink-0 inline-flex items-center justify-center gap-1 rounded-lg bg-[#DFA13F] hover:bg-[#C98B24] transition-colors px-7 py-3.5 text-sm font-semibold text-white"
            >
              Enquiry
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}