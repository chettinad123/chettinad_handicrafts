import React from "react";
import AboutHero from "../components/AboutUsComponents/AboutHero";
import CraftHeritage from "../components/AboutUsComponents/CraftHeritage";
import WhyChoose from "../components/HomeComponents/WhyChoose";
import OurWorkshop from "../components/AboutUsComponents/OurWorkshop";
import MissionAndVision from "../components/AboutUsComponents/MissionAndVision";
import { Award, Package, Truck, Users } from "lucide-react";

const homeWhyChooseItems = [
  {
    icon: Award,
    title: "40+ Years of Craftsmanship",
    desc: "Preserving the rich heritage of Chettinad craftsmanship with decades of experience and excellence.",
  },
  {
    icon: Package,
    title: "Premium Quality Materials",
    desc: "We carefully select premium wood and original granite to ensure durability, beauty, and lasting value.",
  },
  {
    icon: Users,
    title: "Custom-Made Creations",
    desc: "Every product is designed and handcrafted to match your style, space, and requirements.",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    desc: "Delivering handcrafted Chettinad creations safely to homes, villas, temples, and commercial projects across India.",
  },
];

const AboutUs = () => {
  return (
    <div>
      <AboutHero />
      <CraftHeritage />
      <OurWorkshop />
      <MissionAndVision />
      <div className="w-full bg-[#F7F2E8]">
        <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto xl:px-10 lg:px-4 py-16">
          <WhyChoose
            eyebrow="Why Choose Us"
            heading="Crafted with Trust, Build to Last"
            items={homeWhyChooseItems}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;