import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

async function getPotholeReports() {
  const potholesRef = collection(db, 'potholes');
  const q = query(potholesRef, orderBy('reportedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const reports: any[] = [];
  querySnapshot.forEach((doc) => {
    reports.push({ id: doc.id, ...doc.data() });
  });
  return reports;
}

export default async function ReportsPage() {
  const reports = await getPotholeReports();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Pothole Reports</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {reports.length === 0 ? (
          <div className="flex h-[60vh] items-center justify-center">
            <p className="text-muted-foreground">No pothole reports have been submitted yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Reported Pothole</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4 aspect-video w-full">
                    <Image
                      src={report.imageUrl}
                      alt="Pothole"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      data-ai-hint="pothole road"
                    />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Latitude:</strong> {report.latitude.toFixed(5)}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {report.longitude.toFixed(5)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                       Reported on: {new Date(report.reportedAt.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
