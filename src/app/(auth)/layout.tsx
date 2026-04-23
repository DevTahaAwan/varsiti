import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-color-dodge animate-blob" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-accent/40 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-color-dodge animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-color-dodge animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="flex justify-center mb-8">
          <div className="clay-card p-4 rounded-3xl flex items-center justify-center">
            <Image src="/logo.png" alt="Varsiti Logo" width={80} height={80} className="object-contain drop-shadow-md" style={{ width: "auto", height: "auto" }} />
          </div>
        </div>
        
        <div className="flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
