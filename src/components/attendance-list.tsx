
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
// Removed Button import as it's no longer needed
import { Card, CardContent } from '@/components/ui/card'; // Removed header imports
// Removed Trash2 import
import type { AttendanceRecord } from '@/app/page';

interface AttendanceListProps {
  records: AttendanceRecord[];
  // Removed onDelete prop definition
}

// Helper to find subject label
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


// Removed onDelete from component signature
export function AttendanceList({ records }: AttendanceListProps) {
  return (
    <Card className="shadow-none rounded-lg border-none bg-transparent"> {/* Removed card styling, make it transparent */}
      <CardContent className="p-0"> {/* Remove card padding */}
        {records.length === 0 ? (
           // No need for the 'no records' message here, it's handled in the LogPage
           null
        ) : (
          <div className="border rounded-lg overflow-hidden"> {/* Added border wrapper */}
            <Table>
                <TableCaption className="py-4">End of attendance records.</TableCaption>
                <TableHeader className="bg-muted/50"> {/* Subtle header background */}
                <TableRow>
                    <TableHead className="w-[40%] sm:w-[35%]">Subject</TableHead> {/* Adjusted width */}
                    <TableHead className="w-[40%] sm:w-[35%]">Date & Time</TableHead> {/* Adjusted width */}
                    <TableHead className="hidden sm:table-cell sm:w-[30%]">Wallet Address</TableHead> {/* Hide on small screens */}
                    {/* Removed Action TableHead */}
                </TableRow>
                </TableHeader>
                <TableBody>
                {records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30 transition-colors duration-150"> {/* Subtle hover */}
                    <TableCell className="font-medium py-3">{getSubjectLabel(record.subject)}</TableCell>
                    <TableCell className="py-3">{format(new Date(record.dateTime), 'PP p')}</TableCell> {/* Changed format */}
                    <TableCell className="font-mono text-xs truncate max-w-[150px] sm:max-w-none hidden sm:table-cell py-3" title={record.walletAddress ?? 'N/A'}>
                        {record.walletAddress ?? 'N/A'} {/* Show full address on medium+ */}
                    </TableCell>
                    {/* Removed TableCell containing the delete button */}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
