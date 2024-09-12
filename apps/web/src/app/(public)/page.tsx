import Container from "@/components/Container";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProductsList from "@/components/ProductsList";
import ProductBasedDiscount from "@/components/sections/ProductBasedDiscount";

const API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api";

export default function Home() {
  return (
    <div className="">
      <Marquee />
      <Container>
        <Hero />
        {/* <ProductBasedDiscount api_url={API_URL as string} /> */}
        {/* <hr /> */}
        {/* <ProductsList api_url={API_URL as string} /> */}
      </Container>
    </div>
  );
}
