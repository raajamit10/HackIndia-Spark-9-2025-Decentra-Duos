'use client';

import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Lock } from 'lucide-react'; // Import Lock icon
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttendanceFormProps {
  onSubmit: (dateTime: string, password?: string) => void; // Update onSubmit signature
}

export function AttendanceForm({ onSubmit }: AttendanceFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [password, setPassword] = useState<string>(''); // State for password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && password) { // Ensure password is provided
      const [hours, minutes] = time.split(':');
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(parseInt(hours, 10));
      combinedDateTime.setMinutes(parseInt(minutes, 10));
      onSubmit(combinedDateTime.toISOString(), password); // Pass password to onSubmit
      // Optionally clear fields after submission
      // setDate(new Date());
      // setTime(format(new Date(), 'HH:mm'));
      // setPassword('');
    } else if (!password) {
        // Basic validation feedback - could use form libraries for better UX
        alert("Please enter the Unique ID (Password).");
    }
  };

  return (
    <Card className="border-secondary shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Record Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-picker" className="text-muted-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-input" className="text-muted-foreground">Time</Label>
            <div className="relative">
              <Input
                id="time-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
                required
              />
               <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            </div>
          </div>
          {/* Password Input */}
          <div className="space-y-2">
             <Label htmlFor="password-input" className="text-muted-foreground">Unique ID (Password)</Label>
              <div className="relative">
                  <Input
                  id="password-input"
                  type="password" // Use type="password" to mask input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your unique ID"
                  required
                  />
                   <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Submit Attendance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
