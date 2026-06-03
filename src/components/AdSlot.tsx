import React from "react";

interface AdSlotProps {
  position: "hero" | "content" | "faq" | "footer";
  className?: string;
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const labels: Record<string, string> = {
    hero: "Ad - Below Hero (728×90)",
    content: "Ad - After Name Lists (300×250)",
    faq: "Ad - After FAQ (728×90)",
    footer: "Ad - Above Footer (728×90)",
  };

  return (
    <div
      className={`ad-slot my-8 mx-auto max-w-[728px] ${className}`}
      data-ad-position={position}
    >
      <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center h-[90px] text-gray-400 text-sm select-none">
        {labels[position] || "Ad Slot"}
      </div>
    </div>
  );
}
