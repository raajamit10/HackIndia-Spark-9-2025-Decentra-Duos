
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ListChecks, Info } from 'lucide-react'; // Import icons
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AttendanceRecord } from '@/app/page'; // Import type from home page
import { AttendanceList } from '@/components/attendance-list'; // Import the list component
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function LogPage() {
  // Fetch attendance records from local storage
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const { toast } = useToast();

  // Function to delete a record from the log page
  const deleteRecord = (id: string) => {
    setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    toast({
      title: "Record Deleted",
      description: "The attendance record has been removed from the log.",
      variant: "destructive",
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-4 sm:p-8 md:p-12 lg:p-16 bg-background">
      <Card className="w-full max-w-4xl shadow-lg rounded-lg mt-4">
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle className="text-2xl font-bold flex items-center gap-2">
               <ListChecks className="h-6 w-6 text-primary" /> Full Attendance Log
             </CardTitle>
             {/* Optional: Add filtering or export controls here */}
          </div>
           <CardDescription>View all past attendance records. Records are stored locally in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
           {/* Render the AttendanceList component with records from local storage */}
           {attendanceRecords.length > 0 ? (
              <AttendanceList records={attendanceRecords} onDelete={deleteRecord} />
           ) : (
             <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
                <Info className="h-6 w-6" />
                <p>No attendance records found in the log.</p>
                <p className="text-sm">Register attendance on the main page to see records here.</p>
              </div>
           )}

           {/* Go Back Button */}
           <div className="mt-6 text-center">
            <Link href="/" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Registration
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
