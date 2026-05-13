import clsx from "clsx";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-block h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent",
        className
      )}
      aria-label="Loading"
      role="status"
    />
  );
}
