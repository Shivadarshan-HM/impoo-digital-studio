"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Camera, ArrowRight, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getRegisterStatus, registerAdmin } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if single admin registration is open on mount
    const checkStatus = async () => {
      try {
        const res = await getRegisterStatus();
        if (!res.registration_open) {
          toast({
            title: "Registration Closed",
            description: "An admin account already exists. Please log in.",
            variant: "info",
          });
          router.push("/login");
          return;
        }
      } catch (err: any) {
        toast({
          title: "Registration Check Failed",
          description: err.message || "Failed to verify registration status.",
          variant: "error",
        });
        router.push("/login");
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      await registerAdmin(email, password, confirmPassword);

      toast({
        title: "Account Created",
        description: "Admin account created successfully — please sign in.",
        variant: "success",
      });

      // Redirect to login page for explicit authentication step
      router.push("/login");
    } catch (err: any) {
      const errMsg = err.message || "Failed to create admin account.";
      setError(errMsg);

      // If registration was closed server-side, redirect to login after toast
      if (err.status === 403 || errMsg.includes("closed")) {
        toast({
          title: "Registration Closed",
          description: "An admin account already exists.",
          variant: "error",
        });
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen w-full bg-[#080808] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          <p className="text-xs text-muted-foreground font-mono">
            Checking registration availability...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080808] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200, 168, 107, 0.07) 0%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Studio Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-full border border-gold-400/30 bg-gold-400/10 flex items-center justify-center text-gold-400 mb-3 shadow-lg">
            <Camera className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-widest text-foreground uppercase font-serif">
            IMPOO
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400 font-mono mt-1">
            Initial Admin Setup
          </p>
        </div>

        {/* Register Card */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-1.5 pb-4">
            <CardTitle className="text-xl font-medium tracking-tight flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5 text-gold-400" />
              <span>Create Admin Account</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Register the single administrator account for studio portal management
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-9 bg-black/50 border-border/70 focus-visible:border-gold-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                  Password (Min 8 Chars) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <PasswordInput
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9 bg-black/50 border-border/70 focus-visible:border-gold-400"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <PasswordInput
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9 bg-black/50 border-border/70 focus-visible:border-gold-400"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C8A86B] to-[#947437] text-black font-medium hover:brightness-110 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Admin Account
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="pt-2 border-t border-border/60 text-center w-full">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold-400 transition-colors font-mono"
                >
                  <span>Already have an account? Sign In</span>
                </Link>
              </div>

              <p className="text-[0.7rem] text-center text-muted-foreground/60 font-mono">
                IMPOO Digital Studio © 2026 · Confidential Admin System
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
