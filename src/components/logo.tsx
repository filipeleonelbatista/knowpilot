import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
};

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 36, text: "text-lg" },
  lg: { icon: 44, text: "text-xl" },
};

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id="kp-grad" x1="4" y1="4" x2="44" y2="44">
            <stop stopColor="var(--gradient-from, #4f46e5)" />
            <stop offset="0.5" stopColor="var(--gradient-via, #7c3aed)" />
            <stop offset="1" stopColor="var(--gradient-to, #06b6d4)" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="14"
          fill="url(#kp-grad)"
        />
        <path
          d="M14 18c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4h-8l-6 5v-5h-2c-2.2 0-4-1.8-4-4v-8z"
          fill="white"
          fillOpacity="0.95"
        />
        <circle cx="20" cy="22" r="1.8" fill="#4f46e5" />
        <circle cx="26" cy="22" r="1.8" fill="#7c3aed" />
        <circle cx="32" cy="22" r="1.8" fill="#06b6d4" />
        <path
          d="M30 8l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z"
          fill="white"
          fillOpacity="0.9"
        />
      </svg>
      {showText && (
        <span className={`font-bold tracking-tight ${s.text}`}>
          Know<span className="gradient-text">Pilot</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
