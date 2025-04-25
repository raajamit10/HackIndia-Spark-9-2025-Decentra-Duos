'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, ListChecks, Info } from 'lucide-react'; // Import icons
import type { AttendanceRecord } from '@/app/page'; // Import the interface

interface AttendanceListProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
}

// Helper to find subject label from value (can be moved to a shared util if needed)
const subjects = [
  { value: 'math-101', label: 'Mathematics 101' },
  { value: 'phys-202', label: 'Physics 202' },
  { value: 'chem-301', label: 'Chemistry 301' },
  { value: 'hist-110', label: 'History 110' },
];

function getSubjectLabel(value: string): string {
  const subject = subjects.find(s => s.value === value);
  return subject ? subject.label : value; // Return value itself if not found
}


export function AttendanceList({ records, onDelete }: AttendanceListProps) {
  return (
    <Card className="shadow-lg rounded-lg border bg-card text-card-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
           <CardTitle className="text-xl font-bold flex items-center gap-2">
             <ListChecks className="h-5 w-5 text-primary" /> Attendance Log
           </CardTitle>
           {/* Optional: Add filtering or export controls here */}
        </div>
         <CardDescription>A list of your recent attendance records.</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
           <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
              <Info className="h-6 w-6" />
              <p>No attendance records found.</p>
              <p className="text-sm">Register your attendance using the form above.</p>
            </div>
        ) : (
          <Table>
            <TableCaption>End of attendance records.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{getSubjectLabel(record.subject)}</TableCell>
                  <TableCell>{format(new Date(record.dateTime), 'PPP p')}</TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[150px] sm:max-w-[200px]" title={record.walletAddress ?? 'N/A'}>
                    {record.walletAddress ? `${record.walletAddress.substring(0, 6)}...${record.walletAddress.substring(record.walletAddress.length - 4)}` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(record.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
