import React, { useState, Suspense, lazy, Component, ErrorInfo, ReactNode } from "react";
import { Loader2, Orbit } from "lucide-react";

// Lazy-load @splinetool/react-spline for maximum performance and fast initial page load
const Spline = lazy(() => import("@splinetool/react-spline"));

const DEFAULT_SPLINE_SCENE = "https://prod.spline.design/Ap3r1jgs0kwQjDC/scene.splinecode";
const FALLBACK_SPLINE_SCENE = "https://prod.spline.design/Ap3r1jgs0kwQjJDC/scene.splinecode";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline background error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SplineBackground3DProps {
  sceneUrl?: string;
  className?: string;
  isInteractive?: boolean;
  opacity?: number;
  onLoad?: (splineApp: any) => void;
}

export default function SplineBackground3D({
  sceneUrl = DEFAULT_SPLINE_SCENE,
  className = "",
  isInteractive = true,
  opacity = 1,
  onLoad,
}: SplineBackground3DProps) {
  const [currentUrl, setCurrentUrl] = useState(sceneUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSplineLoad = (splineApp: any) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(splineApp);
    }
  };

  const handleSplineError = () => {
    if (currentUrl === DEFAULT_SPLINE_SCENE) {
      setCurrentUrl(FALLBACK_SPLINE_SCENE);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const fallbackMarkup = (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#050814]/80 via-[#0B0F19]/60 to-[#050814]/90">
      <div className="w-full h-full relative overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
      </div>
    </div>
  );

  return (
    <div
      className={`relative w-full h-full overflow-hidden transition-opacity duration-700 ${className}`}
      style={{ opacity }}
    >
      {/* 3D Loading Indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent backdrop-blur-xs select-none pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white/70 text-[10px] font-mono">
            <Orbit size={12} className="animate-spin text-cyan-400" />
            <span>Loading 3D Atmosphere...</span>
          </div>
        </div>
      )}

      {/* Real Spline 3D Scene */}
      {!hasError ? (
        <SplineErrorBoundary fallback={fallbackMarkup}>
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-transparent">
                <Loader2 className="animate-spin text-primary opacity-30" size={20} />
              </div>
            }
          >
            <div className={`w-full h-full ${!isInteractive ? "pointer-events-none" : ""}`}>
              <Spline
                scene={currentUrl}
                onLoad={handleSplineLoad}
                onError={handleSplineError}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </Suspense>
        </SplineErrorBoundary>
      ) : (
        fallbackMarkup
      )}
    </div>
  );
}
