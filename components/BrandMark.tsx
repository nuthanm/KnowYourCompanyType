type BrandMarkProps = {
  className?: string;
  /** Compact wordmark only (no mark), for tight headers */
  wordmarkOnly?: boolean;
};

/** Inline brand mark + KnowYourITHub wordmark matching site navy/blue palette. */
export function BrandMark({ className, wordmarkOnly = false }: BrandMarkProps) {
  return (
    <span className={className ? `brand-mark ${className}` : "brand-mark"}>
      {!wordmarkOnly && (
        <svg
          className="brand-mark-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={22}
          height={22}
          aria-hidden
        >
          <rect width="32" height="32" rx="7" fill="#0c1929" />
          <circle cx="16" cy="16" r="4.4" fill="#ffffff" />
          <circle cx="16" cy="16" r="1.9" fill="#0a66c2" />
          <circle cx="16" cy="6" r="1.75" fill="#0a66c2" />
          <circle cx="16" cy="26" r="1.75" fill="#057642" />
          <circle cx="6" cy="16" r="1.75" fill="#0a66c2" />
          <circle cx="26" cy="16" r="1.75" fill="#0a66c2" />
          <path
            d="M16 10V11.6M16 20.4V22M10 16H11.6M20.4 16H22"
            stroke="#ffffff"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className="brand-mark-text">
        KnowYour<span>ITHub</span>
      </span>
    </span>
  );
}
