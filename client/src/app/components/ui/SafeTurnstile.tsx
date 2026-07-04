import React, { useEffect, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

interface SafeTurnstileProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onExpire: () => void;
  [key: string]: any; // Allow passing down other props
}

export default function SafeTurnstile({
  siteKey,
  onSuccess,
  onExpire,
  ...props
}: SafeTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Monkey patch removeChild on the wrapper container
      // to swallow DOM unmount errors if the Turnstile widget
      // or other third-party scripts already deleted the child.
      const originalRemoveChild = container.removeChild.bind(container);
      container.removeChild = (child: any) => {
        try {
          return originalRemoveChild(child);
        } catch (e) {
          console.warn("Swallowed removeChild error in SafeTurnstile:", e);
          return child;
        }
      };
    }
  }, []);

  return (
    <div ref={containerRef}>
      <Turnstile
        siteKey={siteKey}
        onSuccess={onSuccess}
        onExpire={onExpire}
        {...props}
      />
    </div>
  );
}
