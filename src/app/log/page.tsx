
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Info, FileText, CalendarClock } from 'lucide-react'; // Added CalendarClock icon
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AttendanceRecord } from '@/app/page';
import { AttendanceList } from '@/components/attendance-list';


export default function LogPage() {
  const [attendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);


  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-4 sm:p-8 md:p-12 lg:p-16 bg-background">
       {/* Increased max-width slightly for the extra column */}
      <Card className="w-full max-w-5xl shadow-lg rounded-lg mt-6 border">
        <CardHeader className="bg-muted/50 p-4 rounded-t-lg border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
             <div className="flex items-center gap-3">
                <CalendarClock className="h-7 w-7 text-primary flex-shrink-0" /> {/* Changed Icon */}
                <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                        Attendance Timetable Log
                    </CardTitle>
                    <CardDescription className="mt-1">A chronological, tabular view of your past attendance records stored locally.</CardDescription> {/* Updated Description */}
                </div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
           {attendanceRecords.length > 0 ? (
              // The AttendanceList component already renders a table (tabular form)
              <AttendanceList records={attendanceRecords} />
           ) : (
             <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3 border border-dashed rounded-lg">
                <Info className="h-8 w-8" />
                <p className="font-medium text-lg">No Attendance Records Found</p>
                <p className="text-sm max-w-xs">
                    Your attendance log is currently empty. Register your attendance on the main page first.
                </p>
              </div>
           )}

           {/* Go Back Button */}
           <div className="mt-8 text-center">
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

