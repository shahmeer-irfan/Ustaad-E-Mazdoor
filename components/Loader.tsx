export function Loader({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const dimensions = {
    small: { width: 32, height: 32, offset: 16 },
    medium: { width: 44, height: 44, offset: 22 },
    large: { width: 60, height: 60, offset: 30 }
  };

  const { width, height, offset } = dimensions[size];
  const borderWidth = size === "large" ? 3 : 2;

  return (
    <div className="flex items-center justify-center">
      <div className="spinner-3d" style={{ width: `${width}px`, height: `${height}px` }}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
      <style jsx>{`
        .spinner-3d {
          animation: spinner-rotate 2s infinite ease;
          transform-style: preserve-3d;
          position: relative;
        }

        .spinner-3d > div {
          background-color: rgba(123, 31, 162, 0.15);
          height: 100%;
          position: absolute;
          width: 100%;
          border: ${borderWidth}px solid hsl(262, 83%, 58%);
        }

        .spinner-3d div:nth-of-type(1) {
          transform: translateZ(-${offset}px) rotateY(180deg);
        }

        .spinner-3d div:nth-of-type(2) {
          transform: rotateY(-270deg) translateX(50%);
          transform-origin: top right;
        }

        .spinner-3d div:nth-of-type(3) {
          transform: rotateY(270deg) translateX(-50%);
          transform-origin: center left;
        }

        .spinner-3d div:nth-of-type(4) {
          transform: rotateX(90deg) translateY(-50%);
          transform-origin: top center;
        }

        .spinner-3d div:nth-of-type(5) {
          transform: rotateX(-90deg) translateY(50%);
          transform-origin: bottom center;
        }

        .spinner-3d div:nth-of-type(6) {
          transform: translateZ(${offset}px);
        }

        @keyframes spinner-rotate {
          0% {
            transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
          }
          50% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
          }
          100% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
          }
        }
      `}</style>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader size="large" />
        <p className="mt-6 text-lg text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader size="medium" />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}
