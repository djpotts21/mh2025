"use client";

import clsx from "clsx";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });

export default function HueverseLogo({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-2", inter.className, className)}>
      <div className="relative h-15 w-15">
        <div
          className="absolute inset-0 bg-[conic-gradient(from_150deg_at_50%_50%,#9FD3FF_0deg,#C2A4FF_120deg,#FFC7A3_240deg,#9FD3FF_360deg)]"
          style={{
            WebkitMaskImage:
              "url('data:image/svg+xml;utf8,<svg fill=\"black\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.1 4.435c1.64-1.544 4.29-1.497 5.87.108 1.525 1.552 1.572 4.04.108 5.68L12 16.79 5.922 10.22c-1.464-1.64-1.417-4.128.108-5.68 1.58-1.605 4.23-1.652 5.87-.108z\"/></svg>')",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "cover",
            maskImage:
              "url('data:image/svg+xml;utf8,<svg fill=\"black\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.1 4.435c1.64-1.544 4.29-1.497 5.87.108 1.525 1.552 1.572 4.04.108 5.68L12 16.79 5.922 10.22c-1.464-1.64-1.417-4.128.108-5.68 1.58-1.605 4.23-1.652 5.87-.108z\"/></svg>')",
            maskRepeat: "no-repeat",
            maskSize: "cover",
          }}
        />
      </div>

      <span className="text-2xl font-semibold text-gray-900 dark:text-white tracking-wide">
        hueverse
      </span>
    </div>
  );
}
