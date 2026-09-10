import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);
useEffect(() => {
  console.log("Route changed:", pathname);
  console.log("Current scroll:", window.scrollY);

  window.scrollTo(0, 0);
}, [pathname]);

  return null;
}

export default ScrollToTop;
