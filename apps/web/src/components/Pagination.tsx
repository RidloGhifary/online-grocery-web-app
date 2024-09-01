interface Pagination {
  current_page: number;
  total_page: number;
  back: boolean;
  next: boolean;
}

interface PaginationProps {
  pagination: Pagination;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({ pagination, setPage }: PaginationProps) => {

  return (
    <div className="flex justify-end">
      <div className="join">
        <button
          className="btn btn-primary join-item btn-sm text-white disabled:cursor-not-allowed"
          disabled={!pagination?.back}
          onClick={() => setPage((prev) => prev - 1)}
        >
          «
        </button>
        <button className="btn btn-primary join-item btn-sm text-white">
          Page {pagination?.current_page} - {pagination?.total_page}
        </button>
        <button
          className="btn btn-primary join-item btn-sm text-white disabled:cursor-not-allowed"
          disabled={!pagination?.next}
          onClick={() => setPage((prev) => prev + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
