import { cn } from "@/lib/utils";
import type { JSX, ReactNode } from "react";

export default function WidthConstraint({
  isHome = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  isHome?: boolean;
}): JSX.Element {
  return (
    <div
      className={cn(
        isHome ? "max-w-[1300px]" : "max-w-[1600px]",
        "mx-auto px-5",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
