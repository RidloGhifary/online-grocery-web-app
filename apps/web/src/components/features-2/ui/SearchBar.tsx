import { FaSearch } from "react-icons/fa";
export default function SearchBar() {
  return (
    <>
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="text"
          className="flex-1 max-w-full"
          placeholder="Search"
        />
        <div className="flex items-end justify-end">
          <FaSearch/>
        </div>
      </label>
    </>
  );
}
