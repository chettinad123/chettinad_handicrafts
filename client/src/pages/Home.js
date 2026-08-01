import React from "react";
import HeroSection from "../components/HomeComponents/HeroSection";
import WhyChoose from "../components/HomeComponents/WhyChoose";
import OurExperience from "../components/HomeComponents/OurExperience";
import QualityMaterials from "../components/HomeComponents/QualityMaterials";
import OrderProcess from "../components/HomeComponents/OrderProcess";
import FeaturedProjects from "../components/HomeComponents/FeaturedProjects";
import ClientTestimonials from "../components/HomeComponents/ClientTestimonials";
import HomeCTA from "../components/HomeComponents/HomeCTA";
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

function Home() {
  return (
    <div>
      <HeroSection />
      <OurExperience />
      <QualityMaterials />
      <WhyChoose
        eyebrow="Why Choose Us"
        heading="Crafted with Trust, Build to Last"
        items={homeWhyChooseItems}
      />
      <OrderProcess />
      <FeaturedProjects />
      <ClientTestimonials />
      <HomeCTA />
    </div>
  );
}

export default Home;
