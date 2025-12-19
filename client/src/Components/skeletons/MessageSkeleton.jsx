import React from "react";

function MessageSkeleton() {
  const skeletonMessages = Array(6).fill(null);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, index) => {
        <div
          className={`flex items-start gap3 ${
            index % 2 === 0 ? "justify-start" : "justify-end fles-row-reverse"
          }`}
          key={index}
        >
          {/* { AVATAR   } */}

          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
          {/* MESSAGE BUBBLE */}
          <div className="h-4 w-16 bg-gray-300 roubded mb-2 animate-pulse" />
          <div className="w-50 h-16 bg-gray-300 rounded-lg animate-pulse " />
        </div>;
      })}
    </div>
  );
}

export default MessageSkeleton;
