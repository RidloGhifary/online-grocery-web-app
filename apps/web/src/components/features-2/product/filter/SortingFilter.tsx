export default function SortingFilter() {
  return (
    <>
      <h1 className="my-2 font-bold">Sort</h1>
      <select className="select select-bordered my-3 w-full max-w-xs">
        <option disabled defaultChecked>
          Filtered by . . .
        </option>
        <option value={"category"}>By Category</option>
        <option value={"product_name"}>By Product Name</option>
      </select>
      <select className="select select-bordered w-full max-w-xs">
        <option disabled defaultChecked>
          Choose order . . .
        </option>
        <option value={"ASC"}>Ascending</option>
        <option value={"DSC"}>Descending</option>
      </select>
    </>
  );
}
