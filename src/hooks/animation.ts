import { useEffect } from "react";
import gsap from "gsap";
import "@/animation";

export const useRainbow = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  useEffect(() => {
    if (ref.current) {
      gsap.effects.rainbow(ref.current);
    }
  }, [ref]);
};
