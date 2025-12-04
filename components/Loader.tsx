export function Loader({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "w-14 h-14",
    medium: "w-28 h-28",
    large: "w-28 h-28"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="box1" />
        <div className="box2" />
        <div className="box3" />
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader size="large" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader size="medium" />
      {message && (
        <p className="mt-4 text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
