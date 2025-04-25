
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { format } from 'date-fns';
import { KeyRound, CalendarDays, Copy, WalletCards, BookOpen, Check, Loader2, AlertCircle, Wallet, MapPin, WifiOff } from 'lucide-react'; // Added MapPin, WifiOff
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Ensure Card components are imported correctly
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Skeleton } from '@/components/ui/skeleton';

interface AttendanceRegistrationProps {
  // Update onSubmit prop type to include optional location
  onSubmit: (
    dateTime: string,
    subject: string,
    walletAddress: string | null,
    latitude?: number,
    longitude?: number
  ) => void;
}

// Location state type
type LocationState = {
    latitude: number | null;
    longitude: number | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
};

// Updated subjects list with more engineering options
const subjects = [
  { value: 'math-101', label: 'Calculus I' },
  { value: 'phys-202', label: 'Physics for Engineers' },
  { value: 'chem-301', label: 'General Chemistry' },
  { value: 'cs-101', label: 'Intro to Computer Science' },
  { value: 'ee-201', label: 'Circuit Theory I' },
  { value: 'me-301', label: 'Thermodynamics' },
  { value: 'ce-201', label: 'Statics' },
  { value: 'cs-305', label: 'Data Structures & Algorithms' },
  { value: 'ee-302', label: 'Signals and Systems' },
  { value: 'me-302', label: 'Fluid Mechanics' },
  { value: 'ce-302', label: 'Structural Analysis' },
  { value: 'eng-100', label: 'Introduction to Engineering Design' },
];

// Simple key generation function (replace with secure backend generation)
function generateDailyKey() {
  const datePart = format(new Date(), 'yyyyMMdd');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${datePart}-${randomPart}`;
}


export function AttendanceRegistration({ onSubmit }: AttendanceRegistrationProps) {
  const [dailyKeyInput, setDailyKeyInput] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [todaysGeneratedKey, setTodaysGeneratedKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { account, connectWallet, isLoading: isWalletLoading, error: walletError } = useWalletConnection(); // Keep walletError for display

  // --- Location State ---
  const [location, setLocation] = useState<LocationState>({
      latitude: null,
      longitude: null,
      status: 'idle',
      error: null,
  });

  // --- Function to get location ---
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({ status: 'error', error: 'Geolocation is not supported by your browser.', latitude: null, longitude: null });
      toast({ title: 'Location Error', description: 'Geolocation not supported.', variant: 'destructive'});
      return;
    }

    setLocation(prev => ({ ...prev, status: 'loading', error: null }));
    console.log("Attempting to get location..."); // Debug log

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location success:", position.coords); // Debug log
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: 'success',
          error: null,
        });
         toast({ title: 'Location Acquired', description: 'Your current location has been verified.'});
      },
      (error) => {
        console.error("Location error:", error); // Debug log
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
        setLocation({ status: 'error', error: errorMessage, latitude: null, longitude: null });
        toast({ title: 'Location Error', description: errorMessage, variant: 'destructive'});
      },
      {
        enableHighAccuracy: true, // Request more accurate position
        timeout: 10000, // 10 seconds timeout
        maximumAge: 0, // Don't use cached position
      }
    );
  }, [toast]); // Add toast dependency

  // Generate today's key and attempt to get location when the component mounts
  useEffect(() => {
    setTodaysGeneratedKey(generateDailyKey()); // Replace with actual key fetching if needed
    getLocation(); // Get location on initial load
  }, [getLocation]); // Add getLocation dependency


  const copyToClipboard = (textToCopy: string, message: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: message,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
         toast({
          title: "Copy Failed",
          description: "Could not copy the text to clipboard.",
          variant: "destructive",
        });
      });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check Wallet Connection
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register attendance.",
        variant: "destructive",
      });
      return;
    }

    // 2. Check Location Status
    if (location.status !== 'success' || location.latitude === null || location.longitude === null) {
         toast({
            title: "Location Not Ready",
            description: location.error || "Location could not be verified. Please ensure permissions are granted and try again.",
            variant: "destructive",
        });
        // Optionally offer a retry button:
        // You could add a button here that calls `getLocation()` again.
        return;
    }


    // 3. Check Subject Selection
    if (!selectedSubject) {
      toast({
        title: "Subject Not Selected",
        description: "Please select a subject.",
        variant: "destructive",
      });
      return;
    }

    // 4. Check Daily Key Input
    if (!dailyKeyInput) {
       toast({
        title: "Daily Key Required",
        description: "Please enter the daily key provided for the class.",
        variant: "destructive",
      });
      return;
    }

    // 5. Validate Daily Key (Basic comparison - replace with backend validation)
    if (dailyKeyInput !== todaysGeneratedKey) {
        toast({
            title: "Invalid Daily Key",
            description: "The entered key does not match today's key.",
            variant: "destructive",
        });
        return;
    }


    setIsSubmitting(true); // Start loading indicator

    try {
        // Simulate submission delay (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get current date and time
        const submissionDateTime = new Date().toISOString();

        // Call the onSubmit prop passed from the parent, now including location
        onSubmit(
            submissionDateTime,
            selectedSubject,
            account,
            location.latitude, // Pass latitude
            location.longitude // Pass longitude
        );

        // Reset form fields after successful submission
        setSelectedSubject('');
        setDailyKeyInput('');
        // Optionally reset location or require refresh? For now, keep it.
        // getLocation(); // Re-fetch location for next potential submission

    } catch (err: any) {
        console.error("Submission error:", err);
        toast({
            title: "Registration Failed",
            description: err.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false); // Stop loading indicator
    }
  };

  // Return JSX for the component
  return (
    <Card className="w-full max-w-lg shadow-xl rounded-lg border-none bg-card text-card-foreground overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary-gradient-start to-primary-gradient-end text-primary-foreground rounded-t-lg p-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold">Attendance Registration</CardTitle> {/* Added font-bold */}
         <KeyRound className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
         <p className="text-sm text-muted-foreground">
            Select your subject, enter the daily key, and ensure your location is verified to register attendance.
         </p>

        {/* --- Today's Key Display --- */}
        <div className="bg-muted/50 p-4 rounded-md space-y-3 border border-border/50">
           <div className="flex items-center gap-2 text-sm font-medium text-foreground">
             <KeyRound className="h-4 w-4 text-primary"/>
             <span>Today's Key</span>
           </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3"/>
              <span>Valid for: {format(new Date(), 'PPP')}</span>
            </div>
           <div className="flex items-center justify-between p-3 border border-dashed border-accent/50 rounded-md bg-background text-accent-foreground">
             <code className="text-lg font-mono font-semibold tracking-wider text-accent">
               {todaysGeneratedKey ? (
                    todaysGeneratedKey
                 ) : (
                     <Skeleton className="h-6 w-32" />
                )}
             </code>
              <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 onClick={() => copyToClipboard(todaysGeneratedKey, "Today's key copied!")}
                 className="ml-2 h-7 w-7 text-muted-foreground hover:text-accent"
                 aria-label="Copy Today's Key"
                 disabled={!todaysGeneratedKey}
               >
                 <Copy className="h-4 w-4" />
               </Button>
           </div>
        </div>

         {/* --- Wallet Address Display --- */}
        <div className="space-y-2">
             <Label className="text-sm font-medium text-foreground">Connected Wallet Address</Label>
             <div className="flex items-center gap-2 p-3 border rounded-md bg-input text-sm text-muted-foreground">
                 <WalletCards className="h-4 w-4 text-primary" />
                 {isWalletLoading ? (
                     <Skeleton className="h-4 w-48" />
                 ) : account ? (
                     <span className="truncate font-mono text-foreground flex-1">{account}</span>
                 ) : (
                     <span className="italic flex-1">Not connected</span>
                 )}
                 {account && (
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     onClick={() => copyToClipboard(account, "Wallet address copied!")}
                     className="ml-auto h-7 w-7 text-muted-foreground hover:text-primary flex-shrink-0"
                     aria-label="Copy Wallet Address"
                   >
                     <Copy className="h-4 w-4" />
                   </Button>
                 )}
             </div>
             {!account && !isWalletLoading && (
                 <Button variant="outline" size="sm" onClick={connectWallet} className="mt-2 w-full sm:w-auto">
                     <Wallet className="mr-2 h-4 w-4"/> Connect Wallet
                 </Button>
             )}
             {walletError && (
                 <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/30 mt-2">
                   <AlertCircle className="h-4 w-4" />
                   <span>Wallet Error: {walletError}</span>
                 </div>
             )}
        </div>

        {/* --- Location Status Display --- */}
        <div className="space-y-2">
             <Label className="text-sm font-medium text-foreground">Location Status</Label>
             <div className={cn(
                "flex items-center gap-2 p-3 border rounded-md text-sm",
                location.status === 'success' && "bg-green-100/50 border-green-300/50 text-green-800",
                location.status === 'loading' && "bg-blue-100/50 border-blue-300/50 text-blue-800",
                location.status === 'error' && "bg-destructive/10 border-destructive/30 text-destructive",
                location.status === 'idle' && "bg-input text-muted-foreground"
             )}>
                 {location.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                 {location.status === 'success' && <MapPin className="h-4 w-4 text-green-600" />}
                 {location.status === 'error' && <WifiOff className="h-4 w-4" />}
                 {location.status === 'idle' && <MapPin className="h-4 w-4 text-muted-foreground" />}

                 <span className="flex-1">
                    {location.status === 'loading' && 'Getting location...'}
                    {location.status === 'success' && `Location verified (${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)})`}
                    {location.status === 'error' && (location.error || 'Location error.')}
                    {location.status === 'idle' && 'Waiting for location...'}
                 </span>
                 {/* Retry Button for Location Error */}
                 {location.status === 'error' && (
                     <Button variant="ghost" size="sm" onClick={getLocation} className="ml-auto h-7 text-xs text-destructive hover:bg-destructive/20">
                         Retry
                     </Button>
                 )}
             </div>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">
          {/* --- Subject Select --- */}
          <div className="space-y-2">
            <Label htmlFor="subject-select" className="text-sm font-medium text-foreground">Subject</Label>
             <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Select onValueChange={setSelectedSubject} value={selectedSubject} required>
                  <SelectTrigger id="subject-select" className="pl-10 bg-input">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* --- Daily Key Input --- */}
          <div className="space-y-2">
             <Label htmlFor="daily-key-input" className="text-sm font-medium text-foreground">Daily Key</Label>
              <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                  id="daily-key-input"
                  type="text"
                  value={dailyKeyInput}
                  onChange={(e) => setDailyKeyInput(e.target.value)}
                  className="pl-10 bg-input"
                  placeholder="Enter today's key"
                  required
                  />
              </div>
          </div>

          {/* --- Submit Button --- */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end text-primary-foreground hover:opacity-90 transition-opacity duration-200"
            disabled={isSubmitting || isWalletLoading || location.status !== 'success'} // Disable if submitting, wallet loading, or location not ready
           >
             {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
             )}
            {isSubmitting ? 'Registering...' : 'Register Attendance'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

