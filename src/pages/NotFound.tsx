import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center">
      <div className="page">
        <p className="label text-signal">Error 404</p>
        <h1 className="display mt-4 text-[clamp(3.5rem,9vw,7rem)]">Out of frame.</h1>
        <p className="mt-6 max-w-sm text-lg text-foreground/80">That page doesn't exist.</p>
        <a href="/" className="btn-solid mt-8">
          Back to the start
        </a>
      </div>
    </div>
  );
};

export default NotFound;
