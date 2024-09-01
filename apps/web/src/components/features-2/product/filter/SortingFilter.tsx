export default function SortingFilter() {
  return (
    <>
      <select className="select select-bordered w-full max-w-xs my-3">
        <option disabled >
          Filtered by . . .
        </option>
        <option value={'product_name'}>By Product Name</option>
        <option value={'category'}>By Category</option>
      </select>
      <select className="select select-bordered w-full max-w-xs">
        <option disabled >
          Choose order . . .
        </option>
        <option value={'asc'}>Ascending</option>
        <option value={'desc'}>Descending</option>
      </select>
    </>
  );
}
