
'use client';

import * as React from 'react';
import Link from 'next/link';
import { AttendanceRegistration } from '@/components/attendance-registration';
import { LocationVerifier } from '@/components/location-verifier';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ListChecks, ArrowRight, CheckSquare, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

export interface AttendanceRecord {
  id: string;
  dateTime: string;
  subject: string;
  password?: string; // Daily key used as password
  walletAddress: string; // Changed from string | null
  latitude?: number;
  longitude?: number;
}

// Helper function to get subject label
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

function getSubjectLabel(value: string): string {
  const subject = subjects.find(s => s.value === value);
  return subject ? subject.label : value;
}


export default function Home() {
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [userWalletAddress] = useLocalStorage<string | null>('userWalletAddress', null); // Retrieve wallet address
  const [isLocationVerified, setIsLocationVerified] = React.useState(false);
  const [verifiedLocation, setVerifiedLocation] = React.useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });
  const { toast } = useToast();
  const router = useRouter();

  // Redirect to sign-in if wallet address is not found in local storage
  React.useEffect(() => {
    if (userWalletAddress === null) {
      toast({
        title: "Sign In Required",
        description: "Please sign in and connect your wallet first.",
        variant: "destructive",
      });
      router.push('/signin');
    }
  }, [userWalletAddress, router, toast]);

  const handleLocationVerified = (lat: number, lon: number) => {
    setVerifiedLocation({ latitude: lat, longitude: lon });
    setIsLocationVerified(true);
    toast({
        title: "Location Verified",
        description: "You can now proceed to register your attendance.",
        variant: "default",
    });
  };

  const addRecord = (
    dateTime: string,
    subject: string,
    password: string,
    // walletAddress is now fetched from local storage, not passed here
  ) => {

     if (!userWalletAddress) {
        toast({
            title: "Authentication Error",
            description: "Wallet address not found. Please sign in again.",
            variant: "destructive",
        });
        router.push('/signin');
        return;
     }

     if (!isLocationVerified || verifiedLocation.latitude === null || verifiedLocation.longitude === null) {
        toast({
            title: "Verification Error",
            description: "Location is not verified. Please verify your location first.",
            variant: "destructive",
        });
        setIsLocationVerified(false);
        return;
     }

    // Create and save the record using verified location and stored wallet address
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      dateTime: dateTime,
      subject: subject,
      password: password,
      walletAddress: userWalletAddress, // Use address from local storage
      latitude: verifiedLocation.latitude,
      longitude: verifiedLocation.longitude,
    };

    setAttendanceRecords((prevRecords) => [newRecord, ...prevRecords]);

    toast({
      title: "Attendance Registered",
      description: `Attendance for ${getSubjectLabel(subject)} at ${new Date(dateTime).toLocaleString()} marked successfully.`,
      variant: "default",
    });
  };

  // Prevent rendering content until wallet address is confirmed
  if (userWalletAddress === null) {
      // Optionally show a loading state or just return null while redirecting
      return (
         <main className="flex flex-grow flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-background text-center space-y-10">
            <p className="text-muted-foreground">Redirecting to sign-in...</p>
         </main>
      );
  }

  return (
    <main className="flex flex-grow flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-background text-center space-y-10 animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-out">

       <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-primary flex items-center justify-center gap-2">
              <CheckSquare className="h-8 w-8" /> BlockAttend
          </h1>
          <p className="text-lg text-muted-foreground">
              Securely register your class attendance using your Ethereum wallet, a daily key, and location verification.
          </p>
        </div>

      {/* Step 1: Location Verification */}
      {!isLocationVerified && (
         <LocationVerifier onVerified={handleLocationVerified} />
      )}


      {/* Step 2: Attendance Registration (conditional on location and wallet address) */}
      {isLocationVerified && userWalletAddress && (
          <>
             {/* Render the AttendanceRegistration component */}
            <AttendanceRegistration
               onSubmit={addRecord}
               walletAddress={userWalletAddress} // Pass wallet address as prop
            />

             {/* Separator */}
            <Separator className="my-6 w-full max-w-md" />

             {/* Attendance Log Link Bar */}
            <div className="w-full max-w-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between bg-card border border-border p-4 rounded-lg shadow-sm text-left">
                    <div className="flex items-center gap-2 mb-3 sm:mb-0">
                        <ListChecks className="h-5 w-5 text-primary" />
                        <div>
                            <h2 className="text-lg font-semibold text-card-foreground">Attendance Log</h2>
                            <p className="text-sm text-muted-foreground">View all your past entries.</p>
                        </div>
                    </div>
                    <Link href="/log" passHref>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        View Full Log <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
          </>
      )}

    </main>
  );
}
