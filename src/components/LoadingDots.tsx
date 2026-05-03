/* From vercel/commerce — MIT License */
const dots = "mx-[1px] inline-block h-1 w-1 animate-blink rounded-full";

export default function LoadingDots({ className = "bg-white" }: { className?: string }) {
  return (
    <span className="mx-2 inline-flex items-center">
      <span className={`${dots} ${className}`} />
      <span className={`${dots} animation-delay-200 ${className}`} />
      <span className={`${dots} animation-delay-400 ${className}`} />
    </span>
  );
}
