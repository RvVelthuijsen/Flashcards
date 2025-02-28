import { useRef, useEffect } from "react";

export function useOutsideClickDetector(callback: Function) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };
      document.addEventListener("mouseup", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
      return () => {
        document.removeEventListener("mouseup", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }
  }, [callback]);

  return ref;
}
