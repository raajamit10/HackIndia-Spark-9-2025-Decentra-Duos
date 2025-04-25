'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttendanceRecord } from '@/app/page'; // Assuming interface is defined here

interface AttendanceListProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
}

export function AttendanceList({ records, onDelete }: AttendanceListProps) {
  return (
    <div className="mt-6">
       <h2 className="text-xl font-semibold mb-4 text-foreground">Attendance Records</h2>
      <ScrollArea className="h-[300px] rounded-md border border-secondary">
        <Table>
          <TableCaption className="text-muted-foreground">A list of your recorded attendance times.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70%] text-foreground">Date & Time</TableHead>
              <TableHead className="text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  No attendance records yet.
                </TableCell>
              </TableRow>
            ) : (
              records
                .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()) // Sort by most recent first
                .map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium text-foreground">
                      {format(new Date(record.dateTime), 'PPP p')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(record.id)}
                        className="text-destructive hover:bg-destructive/10"
                        aria-label="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
