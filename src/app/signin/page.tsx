'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  // Placeholder sign-in handler
  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement actual sign-in logic with Firebase Auth or another provider
    console.log('Sign In attempt');
    alert('Sign-in functionality not yet implemented.');
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 bg-secondary"> {/* Adjusted min-height for navbar */}
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </form>
          {/* Optionally add links for password reset or sign up */}
          {/* <div className="mt-4 text-center text-sm">
            <p>
              <a href="#" className="underline text-muted-foreground hover:text-primary">
                Forgot password?
              </a>
            </p>
            <p>
              Don't have an account?{' '}
              <a href="#" className="underline text-muted-foreground hover:text-primary">
                Sign up
              </a>
            </p>
          </div> */}
        </CardContent>
      </Card>
    </main>
  );
}
