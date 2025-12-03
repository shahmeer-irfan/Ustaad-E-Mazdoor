export function Loader({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-primary/80 to-transparent animate-spin"></div>
        <div className="absolute inset-0.5 rounded-full bg-background"></div>
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/60 via-primary/40 to-transparent animate-spin" style={{ animationDuration: "1.5s" }}></div>
        <div className="absolute inset-1.5 rounded-full bg-background"></div>
        
        {/* Inner rotating ring (reverse) */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tl from-primary/40 via-primary/20 to-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "2s" }}></div>
        <div className="absolute inset-2.5 rounded-full bg-background"></div>
        
        {/* Center pulse */}
        <div className="absolute inset-3 rounded-full bg-primary/30 animate-pulse"></div>
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
