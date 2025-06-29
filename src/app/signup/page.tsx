
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { HardHat } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center space-y-2">
           <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <HardHat className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Sign Up Disabled</CardTitle>
          <CardDescription>
            Authentication is currently disabled for development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                disabled
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full text-lg py-6" disabled>
            Create Account
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Want to go to the main page?{" "}
            <Link
              href="/"
              className="font-medium text-primary hover:underline"
              prefetch={false}
            >
              Go to Dashboard
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
