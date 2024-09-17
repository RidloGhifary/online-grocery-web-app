import CategoryFilter from "./CategoryFilter";
import SortingFilter from "./SortingFilter";

export default function ProductFilter() {
  return (
    <>
      <h1 className="my-2 font-bold">Category</h1>
      <CategoryFilter />
      <h1 className="my-2 font-bold">Sort</h1>
      <SortingFilter />
    </>
  );
}
