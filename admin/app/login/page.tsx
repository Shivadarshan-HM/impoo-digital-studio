"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Camera, ArrowRight, AlertCircle, UserPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { loginAdmin, getRegisterStatus } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    // Check if single admin registration is open
    const checkStatus = async () => {
      try {
        const res = await getRegisterStatus();
        setRegistrationOpen(res.registration_open);
      } catch {
        setRegistrationOpen(false);
      }
    };

    checkStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAdmin(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

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
            Studio Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-1.5 pb-4">
            <CardTitle className="text-xl font-medium tracking-tight">
              Sign In to Portal
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your credentials to access the studio management dashboard
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
                  Email Address
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
                  Password
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
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              {/* Show Register Link ONLY if registration is open (0 admins exist) */}
              {registrationOpen && (
                <div className="pt-2 border-t border-border/60 text-center w-full">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors font-mono"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>First time here? Create an admin account</span>
                  </Link>
                </div>
              )}

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
