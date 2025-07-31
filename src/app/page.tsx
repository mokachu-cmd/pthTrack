import { PotholeReporter } from "@/components/pothole-reporter";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 md:p-6">
      <div className="w-full max-w-md">
        <PotholeReporter />
      </div>
    </main>
  );
}
