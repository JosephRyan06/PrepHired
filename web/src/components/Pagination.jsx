import React from "react";

const Pagination = ({ pagination, onChange }) => {
  if (!pagination || pagination.total === 0) return null;

  const { page, limit, total, totalPages } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span>
        Showing {from}-{to} of {total}
      </span>

      <div className="pagination-buttons">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Previous
        </button>

        <span className="pagination-page">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          className="btn btn-ghost"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
