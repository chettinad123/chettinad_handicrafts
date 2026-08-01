import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function FaqCta() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full bg-[#F7F2E8] pb-16 overflow-hidden">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="rounded bg-[#0B1A35] px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <motion.span
              variants={childVariants}
              className="flex items-center justify-center w-12 h-12 text-[#E29C15] flex-shrink-0"
            >
              <MessageCircle className="w-12 h-12" />
            </motion.span>
            <motion.div variants={childVariants} className="item-center">
              <h2 className="font-serif text-xl sm:text-2xl font-regular text-white">
                Still Have Questions?
              </h2>
              <p className="mt-1 text-sm text-white">
                Our team is happy to help you with any information you need
              </p>
            </motion.div>
          </div>

          <motion.button
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/contact-us")}
            className="inline-flex items-center gap-1 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-3 text-sm font-semibold text-white flex-shrink-0"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}