import React from "react";

function SideBarSkeleton() {
  return (
    <div className="w-64 h-screen bg-white border-r p-4 animate-pulse">
      {/* Logo */}
      <div className="h-10 w-32 bg-gray-200 rounded mb-8" />

      {/* Menu items */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Icon */}
            <div className="h-8 w-8 bg-gray-200 rounded-md" />
            {/* Text */}
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Footer / profile */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default SideBarSkeleton;
