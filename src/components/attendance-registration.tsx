
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { KeyRound, CalendarDays, Copy, WalletCards, BookOpen, Check, Loader2, AlertCircle, Wallet } from 'lucide-react'; // Updated icons, added Wallet
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components
import { useToast } from '@/hooks/use-toast';
import { useWalletConnection } from '@/hooks/useWalletConnection'; // Import wallet hook
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

interface AttendanceRegistrationProps {
  // onSubmit expects dateTime, subject, and walletAddress
  onSubmit: (dateTime: string, subject: string, walletAddress: string | null) => void;
}

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Corrected initial state type
  const { toast } = useToast();
  const { account, connectWallet, isLoading: isWalletLoading, error: walletError } = useWalletConnection(); // Use wallet hook

  // Generate today's key when the component mounts
  useEffect(() => {
    setTodaysGeneratedKey(generateDailyKey()); // Replace with actual key fetching if needed
  }, []);

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
    setError(null); // Clear previous errors

    // 1. Check Wallet Connection
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register attendance.",
        variant: "destructive",
      });
      // Optionally trigger wallet connection programmatically
      // await connectWallet();
      return; // Stop submission if wallet not connected
    }

    // 2. Check Subject Selection
    if (!selectedSubject) {
      toast({
        title: "Subject Not Selected",
        description: "Please select a subject.",
        variant: "destructive",
      });
      return;
    }

    // 3. Check Daily Key Input
    if (!dailyKeyInput) {
       toast({
        title: "Daily Key Required",
        description: "Please enter the daily key provided for the class.",
        variant: "destructive",
      });
      return;
    }

    // 4. Validate Daily Key (Basic comparison - replace with backend validation)
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

        // Call the onSubmit prop passed from the parent component
        onSubmit(submissionDateTime, selectedSubject, account);

        // Reset form fields after successful submission
        setSelectedSubject('');
        setDailyKeyInput('');
        // Don't regenerate today's key on submit, it should stay the same for the day

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

  // --- Error Handling ---
  const [error, setError] = useState<string | null>(null); // Local error state for form

  // Display wallet connection errors
  useEffect(() => {
    if (walletError) {
        setError(`Wallet Error: ${walletError}`);
    }
  }, [walletError]);


  return (
    <Card className="w-full max-w-lg shadow-xl rounded-lg border-none bg-card text-card-foreground">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">Attendance Registration</CardTitle>
         <KeyRound className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
         {/* Description Text */}
         <p className="text-sm text-muted-foreground">
            Select your subject and enter the daily key provided for the class to register your attendance. Location will be recorded.
         </p>

        {/* Today's Key Section */}
        <div className="bg-secondary p-4 rounded-md space-y-2 border border-border">
           <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
             <KeyRound className="h-4 w-4 text-primary"/>
             <span>Today's Key</span>
           </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3"/>
              <span>Valid for: {format(new Date(), 'PPP')}</span>
            </div>
           <div className="flex items-center justify-between p-3 border border-dashed border-accent/50 rounded-md bg-muted/50 text-accent-foreground">
             <code className="text-lg font-mono font-semibold tracking-wider text-accent">
               {todaysGeneratedKey || <Skeleton className="h-6 w-32" />}
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

        {/* Connected Wallet Address Section */}
        <div className="space-y-2">
             <Label className="text-sm font-medium text-foreground">Connected Wallet Address</Label>
             <div className="flex items-center gap-2 p-3 border rounded-md bg-input text-sm text-muted-foreground">
                 <WalletCards className="h-4 w-4 text-primary" />
                 {isWalletLoading ? (
                     <Skeleton className="h-4 w-48" />
                 ) : account ? (
                     <span className="truncate font-mono text-foreground">{account}</span>
                 ) : (
                     <span className="italic">Not connected</span>
                 )}
                 {account && (
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     onClick={() => copyToClipboard(account, "Wallet address copied!")}
                     className="ml-auto h-7 w-7 text-muted-foreground hover:text-primary"
                     aria-label="Copy Wallet Address"
                   >
                     <Copy className="h-4 w-4" />
                   </Button>
                 )}
             </div>
             {!account && !isWalletLoading && (
                 <Button variant="outline" size="sm" onClick={connectWallet} className="mt-1">
                     <Wallet className="mr-2 h-4 w-4"/> Connect Wallet
                 </Button>
             )}
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Selection */}
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

          {/* Daily Key Input */}
          <div className="space-y-2">
             <Label htmlFor="daily-key-input" className="text-sm font-medium text-foreground">Daily Key</Label>
              <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                  id="daily-key-input"
                  type="text" // Changed from password to text as per UI
                  value={dailyKeyInput}
                  onChange={(e) => setDailyKeyInput(e.target.value)}
                  className="pl-10 bg-input" // Added padding and background
                  placeholder="Enter today's key"
                  required
                  />
              </div>
          </div>

           {/* Display General Errors */}
           {error && (
             <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/30">
               <AlertCircle className="h-4 w-4" />
               <span>{error}</span>
             </div>
           )}


          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isWalletLoading}>
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
