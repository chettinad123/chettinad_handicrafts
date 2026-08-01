import React from "react";
import ProductsHero from "../components/ProductsComponents/ProductsHero";
// import WhyChooseOurProducts from "../components/ProductsComponents/WhyChooseOurProduct";
import MaterialsUsed from "../components/ProductsComponents/MaterialsUsed";
import ProductsCTA from "../components/ProductsComponents/ProductsCTA";
import OurWorks from "../components/ProductsComponents/OurWorks";
import WhyChoose from "../components/HomeComponents/WhyChoose";
import { Gem, Hammer, Ruler, ShieldCheck } from "lucide-react";

const productsWhyChooseItems = [
  {
    icon: Gem,
    title: "Premium Quality Materials",
    desc: "Crafted using original granite stone and carefully selected premium wood for unmatched quality and durability.",
  },
  {
    icon: Hammer,
    title: "Skilled Artisans",
    desc: "Every product is handcrafted by experienced artisans preserving the rich heritage of Chettinad craftsmanship.",
  },
  {
    icon: Ruler,
    title: "100% Custom-Made",
    desc: "Every creation is designed according to your style, measurements, and architectural requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Built to Last",
    desc: "Our handcrafted creations are designed to offer timeless beauty, lasting strength, and value that grows for generations.",
  },
];

const Products = () => {
  return (
    <div>
      <ProductsHero />
      <OurWorks />
      <div className="bg-[#F7F2E8] px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="mx-auto max-w-[1500px]">
          <WhyChoose
            eyebrow="Why Choose Our Products"
            items={productsWhyChooseItems}
          />
        </div>
      </div>
      <MaterialsUsed />
      <ProductsCTA />
    </div>
  );
};

export default Products;
