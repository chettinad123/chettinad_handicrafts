import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import workshopImg from "../../assets/AboutPageImages/OurShop.webp";

// Matches the visual language of AboutHero.jsx:
// - bg-[#F7F2E8] section background
// - font-serif (Playfair Display) uppercase heading in #5B2D07
// - #E29C15 accent for the outlined CTA button
// - same fadeUp / stagger animation pattern

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

export default function OurWorkshop() {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="w-full bg-[#F7F2E8]">
      <div className="w-full max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10 py-16 sm:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: text */}
          <motion.div
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0 lg:w-1/2"
          >
            <motion.h2
              variants={fadeUp}
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-[#5B2D07] leading-snug"
            >
              Our Workshop
              <br />
              Karaikudi
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm sm:text-base text-[#2A190C] max-w-xl mx-auto lg:mx-0"
            >
              Located in the cultural heart of Chettinad, our workshop is where
              tradition comes to life. Skilled artisans transform original
              granite stones and premium-quality wood into timeless creations
              using techniques passed down through generations. Every product is
              handcrafted with precision, care, and attention to detail before
              reaching our customers.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <button
                onClick={() => navigate("/orders")}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E29C15] hover:bg-[#E29C15]/10 transition-colors px-6 py-3.5 text-sm font-semibold text-[#E29C15]"
              >
                Custom Your Order
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right: image */}
          <motion.div
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="w-full lg:w-1/2"
          >
            <img
              src={workshopImg}
              alt="Craftsmen at work in the Karaikudi workshop"
              className="w-full h-[260px] sm:h-[340px] lg:h-[400px] rounded object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
