
'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MapPin, WifiOff, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Location Configuration ---
const ALLOWED_LOCATION = {
    latitude: 30.00850268544767,
    longitude: 77.76385663463411,
};
const MAX_DISTANCE_KM = 10; // 10000 meters allowed radius

// --- Helper Functions ---

// Haversine formula to calculate distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

interface LocationVerifierProps {
  onVerified: (latitude: number, longitude: number) => void;
}

type LocationState = {
    latitude: number | null;
    longitude: number | null;
    status: 'idle' | 'loading' | 'success' | 'error' | 'verifying' | 'verified';
    error: string | null;
    distance: number | null;
};

export function LocationVerifier({ onVerified }: LocationVerifierProps) {
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        status: 'idle',
        error: null,
        distance: null,
    });
    const { toast } = useToast();

    const verifyLocation = useCallback((lat: number, lon: number) => {
         setLocation(prev => ({ ...prev, status: 'verifying', distance: null }));
         const distance = getDistanceFromLatLonInKm(
            lat,
            lon,
            ALLOWED_LOCATION.latitude,
            ALLOWED_LOCATION.longitude
         );

         console.log(`Distance from allowed location: ${distance.toFixed(4)} km`); // Debug log

         if (distance <= MAX_DISTANCE_KM) {
             setLocation(prev => ({ ...prev, status: 'verified', distance: distance }));
             onVerified(lat, lon); // Notify parent component
         } else {
             const errorMsg = `You are ${distance.toFixed(2)} km away. You must be within ${MAX_DISTANCE_KM * 1000} meters of the allowed location.`;
             setLocation(prev => ({ ...prev, status: 'error', error: errorMsg, distance: distance }));
             toast({
                 title: "Location Out of Range",
                 description: errorMsg,
                 variant: "destructive",
             });
         }
    }, [onVerified, toast]);


    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocation({ status: 'error', error: 'Geolocation is not supported by your browser.', latitude: null, longitude: null, distance: null });
            toast({ title: 'Location Error', description: 'Geolocation not supported.', variant: 'destructive' });
            return;
        }

        setLocation(prev => ({ ...prev, status: 'loading', error: null, latitude: null, longitude: null, distance: null }));
        console.log("Attempting to get location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Location success:", position.coords);
                const { latitude, longitude } = position.coords;
                setLocation(prev => ({ ...prev, latitude, longitude, status: 'success', error: null }));
                toast({ title: 'Location Acquired', description: 'Verifying proximity to allowed location...' });
                verifyLocation(latitude, longitude); // Immediately verify after getting coordinates
            },
            (error) => {
                console.error("Location error:", error);
                let errorMessage = 'Unable to retrieve your location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable it in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get user location timed out.';
                        break;
                    default:
                        errorMessage = `An unknown error occurred (Code: ${error.code}).`;
                        break;
                }
                setLocation({ status: 'error', error: errorMessage, latitude: null, longitude: null, distance: null });
                toast({ title: 'Location Error', description: errorMessage, variant: 'destructive' });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [toast, verifyLocation]);

    return (
        <Card className="w-full max-w-lg shadow-lg rounded-lg border bg-card text-card-foreground">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location Verification
                </CardTitle>
                <CardDescription>
                    Please verify your location to ensure you are within the allowed range for attendance registration.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status Display */}
                 <div className={cn(
                    "flex items-center gap-2 p-3 border rounded-md text-sm",
                    location.status === 'verified' && "bg-green-100/50 border-green-300/50 text-green-800",
                    (location.status === 'loading' || location.status === 'verifying') && "bg-blue-100/50 border-blue-300/50 text-blue-800",
                    location.status === 'error' && "bg-destructive/10 border-destructive/30 text-destructive",
                    (location.status === 'idle' || location.status === 'success') && "bg-input text-muted-foreground" // Combine idle and success visual state before verification
                 )}>
                     {(location.status === 'loading' || location.status === 'verifying') && <Loader2 className="h-4 w-4 animate-spin" />}
                     {location.status === 'verified' && <CheckCircle className="h-4 w-4 text-green-600" />}
                     {location.status === 'error' && <WifiOff className="h-4 w-4" />}
                     {(location.status === 'idle' || location.status === 'success') && <MapPin className="h-4 w-4 text-muted-foreground" />}

                     <span className="flex-1">
                        {location.status === 'loading' && 'Getting location...'}
                        {location.status === 'verifying' && 'Verifying location proximity...'}
                        {location.status === 'success' && `Location acquired (${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}). Verifying...`}
                        {location.status === 'verified' && `Location verified! You are ${location.distance?.toFixed(2)} km away.`}
                        {location.status === 'error' && (location.error || 'Location error.')}
                        {location.status === 'idle' && 'Click the button below to verify your location.'}
                     </span>
                 </div>

                {/* Action Button */}
                <Button
                    onClick={getLocation}
                    disabled={location.status === 'loading' || location.status === 'verifying' || location.status === 'verified'}
                    className="w-full"
                >
                    {(location.status === 'loading' || location.status === 'verifying') && (
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {location.status === 'verified' && (
                         <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                     {(location.status !== 'loading' && location.status !== 'verifying' && location.status !== 'verified') && (
                        <MapPin className="mr-2 h-4 w-4" />
                     )}

                    {location.status === 'loading' && 'Getting Location...'}
                    {location.status === 'verifying' && 'Verifying...'}
                    {location.status === 'verified' && 'Location Verified'}
                    {location.status === 'error' && 'Retry Verification'}
                    {(location.status === 'idle' || location.status === 'success') && 'Verify Location'}
                </Button>
            </CardContent>
        </Card>
    );
}
