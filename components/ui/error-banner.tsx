type ErrorBannerProps = {
  message: string;
  className?: string;
};

export function ErrorBanner({ message, className = "" }: ErrorBannerProps) {
  return (
    <div
      className={`rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
