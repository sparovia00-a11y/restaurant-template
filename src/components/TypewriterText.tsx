"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType } from "react";

export default function TypewriterText({
  text,
  className,
  as: Tag = "p",
  wordDelay = 35,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  wordDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
            transitionDelay: visible ? `${i * wordDelay}ms` : "0ms",
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </Tag>
  );
}
