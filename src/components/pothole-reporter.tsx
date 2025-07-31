"use client";

import { useState, useEffect, useRef, useTransition } from 'react';
import Image from 'next/image';
import { Camera, MapPin, Loader2, CheckCircle, RefreshCw } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { uploadPotholeReport } from '@/app/actions';

type Status = 'locating' | 'error' | 'idle' | 'preview' | 'submitting' | 'success';

interface Location {
  latitude: number;
  longitude: number;
}

export function PotholeReporter() {
  const [status, setStatus] = useState<Status>('locating');
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setStatus('idle');
          setError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Could not get your location. Please enable location services and refresh the page.");
          setStatus('error');
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    // Cleanup object URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStatus('preview');
    }
  };
  
  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setStatus('idle');
    triggerCamera();
  }
  
  const handleSubmit = async () => {
    if (!imageFile || !location) return;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());

    startTransition(async () => {
      setStatus('submitting');
      const result = await uploadPotholeReport(formData);
      if (result.success) {
        setStatus('success');
      } else {
        setError(result.error || 'An unknown error occurred.');
        setStatus('error');
      }
    });
  };

  const resetForm = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setStatus('idle');
  }

  const renderContent = () => {
    switch (status) {
      case 'locating':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Getting your location...</p>
          </div>
        );
      case 'error':
        return (
           <Alert variant="destructive">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        );
      case 'idle':
        return (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">Tap the button below to take a picture of a pothole.</p>
              <Button size="lg" className="w-full" onClick={triggerCamera}>
                <Camera className="mr-2 h-5 w-5" />
                Report a Pothole
              </Button>
            </div>
        );
      case 'preview':
        return (
          <>
            <CardContent className="p-0">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    {imagePreview && (
                        <Image src={imagePreview} alt="Pothole preview" layout="fill" objectFit="cover" data-ai-hint="pothole road" />
                    )}
                </div>
                {location && (
                    <div className="flex items-center space-x-2 p-4 bg-muted/50">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div className="text-sm text-muted-foreground">
                            <p>Lat: {location.latitude.toFixed(5)}, Lon: {location.longitude.toFixed(5)}</p>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="outline" onClick={handleRetake}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake
                </Button>
                <Button onClick={handleSubmit} disabled={isPending} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--primary-foreground))' }} className="hover:opacity-90">
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        "Submit Report"
                    )}
                </Button>
            </CardFooter>
          </>
        );
      case 'submitting':
        return (
            <div className="flex flex-col items-center justify-center space-y-4 p-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Submitting your report...</p>
            </div>
        );
      case 'success':
        return (
            <div className="text-center p-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Report Submitted!</h3>
                <p className="text-muted-foreground mb-6">Thank you for helping improve our roads.</p>
                <Button size="lg" className="w-full" onClick={resetForm}>
                    Report Another Pothole
                </Button>
            </div>
        );
    }
  }

  return (
      <Card className="w-full overflow-hidden shadow-lg">
        <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Pothole Tracker</CardTitle>
          {status !== 'success' && status !== 'locating' && status !== 'submitting' && (
            <CardDescription className="text-center">
              Capture a pothole and we'll geotag it for you.
            </CardDescription>
          )}
        </CardHeader>
        {renderContent()}
      </Card>
  );
}
