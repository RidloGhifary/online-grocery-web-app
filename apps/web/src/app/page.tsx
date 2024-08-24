import Container from "@/components/Container";
import Hero from "@/components/Hero";
import ProductsList from "@/components/ProductsList";
import ProductBasedDiscount from "@/components/sections/ProductBasedDiscount";
import ProductBasedNearestStore from "@/components/sections/ProductBasedNearestStore";

export default function Home() {
  return (
    <div className="">
      <Container>
        <Hero />
        <ProductBasedDiscount />
        <hr />
        <ProductBasedNearestStore />
        <hr />
        <ProductsList />
      </Container>
    </div>
  );
}
