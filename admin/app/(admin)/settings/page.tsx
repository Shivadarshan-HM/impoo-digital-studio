"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  KeyRound,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  getStudioSettings,
  updateStudioSettings,
  changePassword,
  logoutAdmin,
  StudioSettings,
} from "@/lib/api";

export default function SettingsPage() {
  const { toast } = useToast();

  const [savedSettings, setSavedSettings] = useState<StudioSettings | null>(null);
  const [form, setForm] = useState<Partial<StudioSettings>>({
    studio_name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Fetch Settings on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getStudioSettings();
        setSavedSettings(data);
        setForm(data);
      } catch (err: any) {
        toast({
          title: "Error Loading Settings",
          description: err.message || "Failed to fetch studio settings.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Studio Info Form Validation
  const errors = useMemo(() => {
    const errs: { phone?: string; email?: string; studio_name?: string } = {};

    if (!form.studio_name?.trim()) {
      errs.studio_name = "Studio name cannot be empty.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email?.trim()) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const cleanedPhone = (form.phone || "").replace(/[^0-9]/g, "");
    if (!form.phone?.trim()) {
      errs.phone = "Phone number is required.";
    } else if (cleanedPhone.length < 8) {
      errs.phone = "Please enter a valid phone number.";
    }

    return errs;
  }, [form]);

  const isFormDirty = useMemo(() => {
    if (!savedSettings) return false;
    return (
      form.studio_name !== savedSettings.studio_name ||
      form.phone !== savedSettings.phone ||
      form.email !== savedSettings.email ||
      form.address !== savedSettings.address
    );
  }, [form, savedSettings]);

  const isValid = Object.keys(errors).length === 0;

  // Password Form Client-Side Validation
  const passwordValidationError = useMemo(() => {
    if (!newPassword && !confirmPassword) return null;
    if (newPassword.length < 8) {
      return "New password must be at least 8 characters long.";
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      return "New password and confirm password do not match.";
    }
    return null;
  }, [newPassword, confirmPassword]);

  const isPasswordFormValid =
    currentPassword.trim().length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleReset = () => {
    if (savedSettings) {
      setForm(savedSettings);
      toast({
        title: "Changes Reset",
        description: "Form reset to current saved studio settings.",
        variant: "info",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please resolve form errors before saving.",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      const updated = await updateStudioSettings({
        studio_name: form.studio_name?.trim(),
        phone: form.phone?.trim(),
        email: form.email?.trim(),
        address: form.address?.trim(),
      });

      setSavedSettings(updated);
      setForm(updated);

      toast({
        title: "Settings Saved",
        description: "Studio contact info and branding updated successfully.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message || "Failed to update studio settings.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!isPasswordFormValid) return;

    setIsChangingPassword(true);

    try {
      await changePassword(currentPassword, newPassword);

      toast({
        title: "Password Updated",
        description: "Password updated successfully — logging out for re-authentication.",
        variant: "success",
      });

      // Clear form inputs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Log out after a short delay so toast is visible
      setTimeout(() => {
        logoutAdmin();
      }, 1200);
    } catch (err: any) {
      const errMsg = err.message || "Failed to update password.";
      setPasswordError(errMsg);
      toast({
        title: "Password Change Failed",
        description: errMsg,
        variant: "error",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          <p className="text-xs text-muted-foreground font-mono">
            Loading studio settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif uppercase text-foreground">
              Studio Configuration
            </h1>
            <Badge variant="gold">
              Live API
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage studio branding, contact info &amp; admin account security
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings & Password Change (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. General Studio Info Card */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gold-400" />
                <span>General Studio Info</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                This contact information is displayed on the public website footer and contact section
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSave}>
              <CardContent className="space-y-5 pt-6">
                {/* Studio Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Studio Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={form.studio_name || ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, studio_name: e.target.value }))
                      }
                      placeholder="e.g. IMPO Digital Studio"
                      className="pl-9 bg-black/50 border-border focus-visible:border-gold-400"
                    />
                  </div>
                  {errors.studio_name && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.studio_name}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={form.phone || ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+91 98765 43210"
                      className="pl-9 bg-black/50 border-border focus-visible:border-gold-400"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Email Address Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={form.email || ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="contact@impodigitalstudio.com"
                      className="pl-9 bg-black/50 border-border focus-visible:border-gold-400"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Studio Physical Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Physical Studio Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      rows={3}
                      value={form.address || ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, address: e.target.value }))
                      }
                      placeholder="Enter studio address..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-black/50 border border-border text-foreground focus:outline-none focus:border-gold-400 resize-none font-sans"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!isFormDirty || isSaving}
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Reset Changes
                </Button>

                <Button
                  type="submit"
                  disabled={!isFormDirty || !isValid || isSaving}
                  className="bg-gold-400 text-black hover:bg-gold-300 transition-colors text-xs font-medium px-6"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Saving Changes...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Save className="h-3.5 w-3.5" />
                      Save Configuration
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* 2. Change Admin Password Card */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2">
                <Lock className="h-5 w-5 text-gold-400" />
                <span>Change Admin Password</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Update credentials for your administrator account. Security requirement: minimum 8 characters.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-5 pt-6">
                {passwordError && (
                  <div className="p-3 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* Current Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Current Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                    <PasswordInput
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setPasswordError(null);
                      }}
                      placeholder="Enter current password"
                      className="pl-9 bg-black/50 border-border focus-visible:border-gold-400"
                    />
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    New Password (Min 8 Chars) *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordError(null);
                      }}
                      placeholder="Enter new password"
                      className="pl-9 bg-black/50 border-border focus-visible:border-gold-400"
                    />
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError(null);
                      }}
                      placeholder="Re-enter new password"
                      className="pl-9 bg-black/50 border-border focus-visible:border-gold-400"
                    />
                  </div>
                </div>

                {passwordValidationError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{passwordValidationError}</span>
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-end pt-4 border-t border-border/60">
                <Button
                  type="submit"
                  disabled={!isPasswordFormValid || isChangingPassword}
                  className="bg-gold-400 text-black hover:bg-gold-300 transition-colors text-xs font-medium px-6"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Updating Password...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Update Password
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Live Preview Column (1 Col) */}
        <div className="space-y-6">
          <Card className="border border-gold-400/30 bg-gold-400/5 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono tracking-widest text-gold-400 uppercase flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Live Footer Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-lg bg-black/60 border border-border/70 space-y-3">
                <h4 className="font-serif text-lg font-light uppercase tracking-wider text-foreground">
                  {form.studio_name || "IMPO Digital Studio"}
                </h4>
                <div className="space-y-1.5 text-muted-foreground font-mono text-[0.7rem]">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gold-400" />
                    <span>{form.phone || "+91 98765 43210"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gold-400" />
                    <span>{form.email || "contact@impodigitalstudio.com"}</span>
                  </p>
                  <p className="flex items-start gap-2 pt-1">
                    <MapPin className="h-3 w-3 text-gold-400 shrink-0 mt-0.5" />
                    <span>
                      {form.address ||
                        "N.G Complex, Belaganahalli Road, Opposite Police Station, Heggadadevanakote, Karnataka – 571114"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
