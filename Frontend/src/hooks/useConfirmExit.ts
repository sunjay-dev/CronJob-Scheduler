import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export function useConfirmExit(isFilled: boolean, shouldBlock: boolean = true) {

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFilled || !shouldBlock) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFilled, shouldBlock]);
  
   const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isFilled && shouldBlock && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (shouldBlock && blocker.state === "blocked") {
      const ok = window.confirm("You have unsaved changes. Are you sure you want to leave this page?");
      if (ok) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, shouldBlock]);
}
