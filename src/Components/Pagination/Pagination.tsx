import cn from "classnames";
import "./Pagination.scss";

type Props = {
  onPreviousPage: () => void;
  onNextPage: () => void;
  previous: string | null;
  next: string | null;
  count: number;
  currentPage: number;
};

const PAGE_SIZE = 4;

export const Pagination: React.FC<Props> = ({
  onPreviousPage,
  onNextPage,
  previous,
  next,
  count,
  currentPage,
}) => {
  const totalPages = Math.ceil(count / PAGE_SIZE);
  return (
    <div className="pagination">
      <button
        className={cn("pagination__button", {
          "pagination__button--disabled": !previous,
        })}
        onClick={onPreviousPage}
        disabled={!previous}
      >
        Prev
      </button>

      <span className="pagination__info">
        {currentPage} of {totalPages}
      </span>

      <button
        className={cn("pagination__button", {
          "pagination__button--disabled": !next,
        })}
        onClick={onNextPage}
        disabled={!next}
      >
        Next
      </button>
    </div>
  );
};
