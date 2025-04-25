
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ListChecks, Info, FileText } from 'lucide-react'; // Added FileText
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AttendanceRecord } from '@/app/page';
import { AttendanceList } from '@/components/attendance-list';
import { useToast } from '@/hooks/use-toast';

export default function LogPage() {
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const { toast } = useToast();

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
      <Card className="w-full max-w-4xl shadow-lg rounded-lg mt-6 border"> {/* Added margin-top and border */}
        <CardHeader className="bg-muted/50 p-4 rounded-t-lg border-b"> {/* Subtle background for header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
             <div className="flex items-center gap-3">
                <FileText className="h-7 w-7 text-primary flex-shrink-0" /> {/* Slightly larger icon */}
                <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                        Full Attendance Log
                    </CardTitle>
                    <CardDescription className="mt-1">View all past attendance records stored locally in your browser.</CardDescription>
                </div>
             </div>
             {/* Optional: Add filtering or export controls here later */}
             {/* <Button variant="outline" size="sm">Filter</Button> */}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6"> {/* Adjusted padding */}
           {attendanceRecords.length > 0 ? (
              <AttendanceList records={attendanceRecords} onDelete={deleteRecord} />
           ) : (
             <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3 border border-dashed rounded-lg"> {/* More padding and border */}
                <Info className="h-8 w-8" /> {/* Larger icon */}
                <p className="font-medium text-lg">No Attendance Records Found</p>
                <p className="text-sm max-w-xs">
                    Your attendance log is currently empty. Register your attendance on the main page first.
                </p>
              </div>
           )}

           {/* Go Back Button */}
           <div className="mt-8 text-center"> {/* Increased margin-top */}
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
