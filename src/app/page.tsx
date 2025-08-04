import { PotholeReporter } from "@/components/pothole-reporter";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-6">
      <div className="w-full max-w-md">
        <PotholeReporter />
      </div>
      <div className="mt-8 text-center">
        <Link href="/reports" passHref>
          <Button variant="link">View All Reports</Button>
        </Link>
      </div>
    </main>
  );
}
