
'use client';

import * as React from 'react';
import Link from 'next/link';
import { AttendanceRegistration } from '@/components/attendance-registration';
import { LocationVerifier } from '@/components/location-verifier'; // Import LocationVerifier
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ListChecks, ArrowRight, CheckSquare, MapPin } from 'lucide-react'; // Added CheckSquare, MapPin

export interface AttendanceRecord {
  id: string;
  dateTime: string;
  subject: string;
  password?: string;
  walletAddress: string | null;
  latitude?: number; // Store location
  longitude?: number; // Store location
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
  const [isLocationVerified, setIsLocationVerified] = React.useState(false); // State for location verification
  const [verifiedLocation, setVerifiedLocation] = React.useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null }); // Store verified location
  const { toast } = useToast();


  const handleLocationVerified = (lat: number, lon: number) => {
    setVerifiedLocation({ latitude: lat, longitude: lon });
    setIsLocationVerified(true);
    toast({
        title: "Location Verified",
        description: "You can now proceed to register your attendance.",
        variant: "default",
    });
  };

  // Updated addRecord to accept location from verified state
  const addRecord = (
    dateTime: string,
    subject: string,
    password: string,
    walletAddress: string | null,
    // Removed latitude/longitude from args, will use verifiedLocation state
  ) => {

     if (!isLocationVerified || verifiedLocation.latitude === null || verifiedLocation.longitude === null) {
        toast({
            title: "Verification Error",
            description: "Location is not verified. Please verify your location first.",
            variant: "destructive",
        });
        // Optional: redirect or reset state if needed
        setIsLocationVerified(false);
        return;
     }

    // Create and save the record using verified location
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      dateTime: dateTime,
      subject: subject,
      password: password,
      walletAddress: walletAddress,
      latitude: verifiedLocation.latitude, // Use verified location
      longitude: verifiedLocation.longitude, // Use verified location
    };

    setAttendanceRecords((prevRecords) => [newRecord, ...prevRecords]);

    toast({
      title: "Attendance Registered",
      description: `Attendance for ${getSubjectLabel(subject)} at ${new Date(dateTime).toLocaleString()} marked successfully.`,
      variant: "default",
    });
  };

  return (
    // Use flex container with flex-col, center items, and adjust padding
    // Add animation classes: animate-in, fade-in-0, slide-in-from-top-4
    <main className="flex flex-grow flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-background text-center space-y-10 animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-out">

       {/* Introductory Text */}
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


      {/* Step 2: Attendance Registration (conditional) */}
      {isLocationVerified && (
          <>
             {/* Render the AttendanceRegistration component */}
            <AttendanceRegistration
               onSubmit={addRecord}
               // Pass verified location down if needed, though addRecord now uses state
               // verifiedLatitude={verifiedLocation.latitude}
               // verifiedLongitude={verifiedLocation.longitude}
            />

             {/* Separator */}
            <Separator className="my-6 w-full max-w-md" /> {/* Shortened separator */}

             {/* Attendance Log Link Bar */}
            <div className="w-full max-w-lg space-y-4">
                {/* Styled Div Bar for Attendance Log Title and Link */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-card border border-border p-4 rounded-lg shadow-sm text-left"> {/* Adjusted background and layout */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-0">
                        <ListChecks className="h-5 w-5 text-primary" />
                        <div>
                            <h2 className="text-lg font-semibold text-card-foreground">Attendance Log</h2>
                            <p className="text-sm text-muted-foreground">View all your past entries.</p>
                        </div>
                    </div>
                    <Link href="/log" passHref>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto"> {/* Changed variant */}
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

