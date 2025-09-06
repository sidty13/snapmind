import React from "react";
export default function AuroraBackground() {
  return (
    <div
      className="absolute inset-0 -z-10 blur-[100px] opacity-60"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, #f472b6, transparent 60%), radial-gradient(circle at 80% 40%, #34d399, transparent 60%), radial-gradient(circle at 50% 80%, #60a5fa, transparent 60%)",
      }}
    />
  );
}
