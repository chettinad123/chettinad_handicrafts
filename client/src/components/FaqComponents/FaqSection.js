import React, { useState, useMemo, useRef } from "react";
import { Search, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// NOTE: Section headings/labels use the same serif display face as the rest
// of the site:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const categories = [
  "All",
  "Products",
  "Materials",
  "Custom Orders",
  "Delivery",
  "Installation",
  "General",
];

const faqs = [
  {
    question: "Where can I buy handcrafted stone pillars in India?",
    answer:
      "If you're looking for handcrafted stone pillars made from original granite, Chettinad Handicrafts offers custom-designed granite pillars crafted by skilled artisans in Karaikudi. We deliver across India.",
    category: "Products",
  },
  {
    question: "Where can I buy traditional wooden doors?",
    answer:
      "Chettinad Handicrafts manufactures premium handcrafted wooden doors using Teak, Rose, Satin, Jack, Vengai, and Vembu wood. Every door is custom-made to match your design, size, and architectural style.",
    category: "Products",
  },
  {
    question: "Which wood is best for wooden doors?",
    answer:
      "The best wood depends on your requirements. Teak is known for its durability, Rose Wood offers a premium finish, Satin Wood provides a smooth texture, while Jack, Vengai, and Vembu are excellent choices for traditional craftsmanship. At Chettinad Handicrafts, we help you choose the right wood for your project.",
    category: "Materials",
  },
  {
    question: "Where can I buy authentic Tanjore paintings?",
    answer:
      "Chettinad Handicrafts offers authentic handcrafted Tanjore paintings created using traditional techniques. We also undertake custom orders and restoration of old Tanjore paintings.",
    category: "Products",
  },
  {
    question: "Do you make customized wooden furniture?",
    answer:
      "Yes. We design and manufacture custom wooden furniture, including tables, chairs, wardrobes, pooja units, swings, and other heritage-inspired furniture based on your requirements.",
    category: "Custom Orders",
  },
  {
    question: "Can I customize wooden doors and stone pillars?",
    answer:
      "Yes. Every product at Chettinad Handicrafts is custom-made. You can choose the design, dimensions, carvings, materials, and finish to suit your home or commercial space.",
    category: "Custom Orders",
  },
  {
    question: "Do you deliver handcrafted products across India?",
    answer:
      "Yes. We provide safe and reliable Pan India delivery for handcrafted wooden products, granite stone works, furniture, and Tanjore paintings.",
    category: "Delivery",
  },
  {
    question: "What makes original granite stone pillars a better choice?",
    answer:
      "Original granite stone pillars are known for their exceptional strength, natural beauty, and durability. They require minimal maintenance and retain their value for generations, making them an excellent long-term investment.",
    category: "Materials",
  },
  {
    question: "Can old Tanjore paintings be restored?",
    answer:
      "Yes. We provide professional Tanjore painting restoration and dull-finish rework services to restore the beauty and originality of your artwork.",
    category: "General",
  },
  {
    question: "How do I get a quotation for custom wood or stone work?",
    answer:
      "Simply contact Chettinad Handicrafts through our website, phone, WhatsApp, or email. Share your measurements, design references, or project details, and we'll provide a customized quotation.",
    category: "General",
  },
  {
    question:
      "Why should I choose handcrafted products instead of machine-made products?",
    answer:
      "Handcrafted products offer superior detailing, premium quality, unique craftsmanship, and long-lasting durability. Every piece is individually crafted by skilled artisans, making it truly one of a kind.",
    category: "General",
  },
  {
    question: "Where is the best place to buy Chettinad-style wooden doors?",
    answer:
      "Chettinad Handicrafts in Karaikudi specializes in authentic Chettinad-style wooden doors with traditional carvings, premium-quality wood, and fully customized designs for homes, villas, temples, and commercial spaces.",
    category: "General",
  },
  {
    question:
      "How long do handcrafted wooden doors and granite pillars last?",
    answer:
      "When crafted from premium wood and original granite and maintained properly, handcrafted wooden doors and granite pillars can last for decades while retaining their beauty and structural strength.",
    category: "General",
  },
  {
    question: "Do you undertake temple, villa, and heritage projects?",
    answer:
      "Yes. We undertake custom projects for homes, villas, temples, heritage buildings, resorts, hotels, and commercial spaces, delivering handcrafted solutions across India.",
    category: "Custom Orders",
  },
  {
    question: "Why choose Chettinad Handicrafts?",
    answer:
      "With over 40 years of experience since 1986, Chettinad Handicrafts combines traditional craftsmanship, skilled artisans, premium materials, and customized designs to create timeless handcrafted masterpieces that last for generations.",
    category: "General",
  },
];

export default function FaqSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch = faq.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const scrollCategories = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };



  const searchVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const faqVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const answerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: -4,
      marginBottom: 4,
      paddingTop: 4,
      paddingBottom: 20,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    closed: {
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      rotate: 180,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="w-full bg-[#F7F2E8] py-16"
    >
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        {/* Search bar */}
        <motion.div variants={searchVariants} className="flex items-stretch gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your question..."
            className="flex-1 rounded border border-[#E29C15] bg-[#F7F2E8] px-4 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/30 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
          />
          <motion.button
            type="button"
            aria-label="Search"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-12 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors flex-shrink-0"
          >
            <Search className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>

        {/* Category filters - Responsive with scroll on mobile */}
        <motion.div
          variants={searchVariants}
          transition={{ delay: 0.1 }}
          className="mt-5 relative"
        >
          {/* Mobile scroll buttons - visible only on small screens */}
          <div className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => scrollCategories('left')}
              className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-[#0B1A35]" />
            </button>
          </div>
          
          <div className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => scrollCategories('right')}
              className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-[#0B1A35]" />
            </button>
          </div>

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex lg:flex-wrap gap-2.5 overflow-x-auto lg:overflow-visible scrollbar-hide pb-2 lg:pb-0 px-6 lg:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  variants={categoryVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded border px-4 py-1.5 text-sm font-regular transition-all whitespace-nowrap flex-shrink-0 lg:flex-shrink ${
                    isActive
                      ? "bg-[#E29C15] border-[#E29C15] text-white shadow-md"
                      : "bg-[#F5E6CA] border-[#E29C15]/60 text-[#0B1A35] hover:border-[#E29C15] hover:bg-[#F0DDB8]"
                  }`}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ accordion list */}
        <motion.div className="mt-8 space-y-4">
          <AnimatePresence mode="wait">
            {filteredFaqs.length === 0 && (
              <motion.p
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-sm text-[#0B1A35]/60 text-center py-8"
              >
                No questions found. Try a different search or category.
              </motion.p>
            )}

            {filteredFaqs.map((faq, index) => {
              const isOpen = index === openIndex;
              return (
                <motion.div
                  key={faq.question}
                  variants={faqVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="rounded-lg border border-[#E29C15] bg-[#F7F2E8] overflow-hidden"
                >
                  <motion.button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4 text-left"
                    aria-expanded={isOpen}
                    whileHover={{ backgroundColor: "rgba(226, 156, 21, 0.05)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-serif text-sm sm:text-base lg:text-lg text-[#5B2D07] flex-1">
                      {faq.question}
                    </span>
                    <motion.span
                      className="flex items-center justify-center w-6 h-6 text-[#E29C15] flex-shrink-0"
                      variants={iconVariants}
                      initial="closed"
                      animate={isOpen ? "open" : "closed"}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </motion.span>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        variants={answerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="px-4 sm:px-6 overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}