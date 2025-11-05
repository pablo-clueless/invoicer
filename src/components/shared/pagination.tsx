import { cn } from "@/lib";

interface Props {
  current: number;
  limit: number;
  onPageChange: (page: number) => void;
  total: number;
  buttonClassName?: string;
  className?: string;
  numberButtonClassName?: string;
}

export const Pagination = ({
  current,
  limit,
  onPageChange,
  total,
  buttonClassName,
  className,
  numberButtonClassName,
}: Props) => {
  const totalPages = Math.ceil(total / limit);

  const goToPrevious = () => {
    if (current > 1) {
      return onPageChange(current - 1);
    }
  };

  const goToNext = () => {
    if (current < totalPages) {
      onPageChange(current + 1);
    }
  };

  const renderPageButton = (index: number) => (
    <button
      key={index}
      onClick={() => onPageChange(index)}
      disabled={current === index}
      className={cn(
        "grid size-7 place-items-center rounded-md text-xs font-medium",
        current === index ? "bg-primary-600 text-secondary-200" : "border bg-white",
        numberButtonClassName,
      )}
    >
      {index}
    </button>
  );

  const renderButtons = () => {
    const numbers = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(renderPageButton(i));
      }
    } else {
      numbers.push(renderPageButton(1));
      if (current <= 3) {
        for (let i = 2; i <= 4; i++) {
          numbers.push(renderPageButton(i));
        }
        numbers.push(
          <span key="ellipsis" className="px-2">
            ...
          </span>,
        );
      } else if (current >= totalPages - 2) {
        numbers.push(
          <span key="ellipsis" className="px-2">
            ...
          </span>,
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          numbers.push(renderPageButton(i));
        }
      } else {
        numbers.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>,
        );
        for (let i = current - 1; i <= current + 1; i++) {
          numbers.push(renderPageButton(i));
        }
        numbers.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>,
        );
      }

      numbers.push(renderPageButton(totalPages));
    }

    return numbers;
  };

  return (
    <div className={cn("flex w-full items-center justify-center gap-x-4", className)}>
      <button
        className={cn(
          "bg-primary-500 text-secondary-200 h-7 rounded-md px-3 text-xs font-medium disabled:cursor-not-allowed disabled:border disabled:bg-white disabled:text-neutral-800",
          buttonClassName,
        )}
        disabled={totalPages === 0 || current === 1}
        onClick={goToPrevious}
        type="button"
      >
        Prev
      </button>
      <div className="flex items-center gap-x-3">{renderButtons()}</div>
      <button
        className={cn(
          "bg-primary-500 text-secondary-200 h-7 rounded-md px-3 text-xs font-medium disabled:cursor-not-allowed disabled:border disabled:bg-white disabled:text-neutral-800",
          buttonClassName,
        )}
        disabled={totalPages === 0 || current === totalPages}
        onClick={goToNext}
        type="button"
      >
        Next
      </button>
    </div>
  );
};
