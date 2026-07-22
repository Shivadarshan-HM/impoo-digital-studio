"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderTree,
  Camera,
  Users,
  Sparkles,
  Upload,
  FolderPlus,
  MailCheck,
  ArrowRight,
  Calendar,
  PhoneCall,
  ExternalLink,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { getDashboardStats, DashboardStats, Lead } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper for status badge styling
  const renderStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="gold">New Inquiry</Badge>;
      case "contacted":
        return (
          <Badge className="border-sky-500/40 bg-sky-500/10 text-sky-400">
            Contacted
          </Badge>
        );
      case "closed":
        return <Badge variant="success">Booked / Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif uppercase text-foreground">
              Studio Overview
            </h1>
            <Badge variant="gold">Phase 9 Live API</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome back, Ravikumar. Here is your studio&apos;s activity &amp; booking overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card/50 text-xs text-muted-foreground font-mono">
            <Calendar className="h-3.5 w-3.5 text-gold-400" />
            <span>{currentDateStr}</span>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Row (4 Columns Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: Total Categories */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="border-border/80 bg-card/60 backdrop-blur-md hover:border-gold-400/40 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                Total Categories
              </span>
              <div className="h-8 w-8 rounded-md border border-gold-400/30 bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <FolderTree className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light font-serif tracking-tight text-foreground">
                {loading ? (
                  <span className="h-6 w-12 block bg-white/10 animate-pulse rounded" />
                ) : (
                  stats?.total_categories ?? 0
                )}
              </div>
              <p className="text-[0.7rem] text-muted-foreground font-mono mt-1">
                Active portfolio categories
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stat Card 2: Total Photos */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-border/80 bg-card/60 backdrop-blur-md hover:border-gold-400/40 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                Total Photos
              </span>
              <div className="h-8 w-8 rounded-md border border-gold-400/30 bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Camera className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light font-serif tracking-tight text-foreground">
                {loading ? (
                  <span className="h-6 w-12 block bg-white/10 animate-pulse rounded" />
                ) : (
                  stats?.total_photos ?? 0
                )}
              </div>
              <p className="text-[0.7rem] text-gold-400 font-mono mt-1">
                Uploaded gallery photos
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stat Card 3: Total Leads */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="border-border/80 bg-card/60 backdrop-blur-md hover:border-gold-400/40 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                Total Leads
              </span>
              <div className="h-8 w-8 rounded-md border border-gold-400/30 bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light font-serif tracking-tight text-foreground">
                {loading ? (
                  <span className="h-6 w-12 block bg-white/10 animate-pulse rounded" />
                ) : (
                  stats?.total_leads ?? 0
                )}
              </div>
              <p className="text-[0.7rem] text-emerald-400 font-mono mt-1">
                Client booking inquiries
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stat Card 4: New / Actionable Leads */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-gold-400/40 bg-gold-400/5 backdrop-blur-md hover:border-gold-400 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-mono tracking-wider uppercase text-gold-400">
                New Inquiries
              </span>
              <div className="h-8 w-8 rounded-md border border-gold-400/40 bg-gold-400/20 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Sparkles className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light font-serif tracking-tight text-gold-400">
                {loading ? (
                  <span className="h-6 w-12 block bg-gold-400/20 animate-pulse rounded" />
                ) : (
                  stats?.unread_leads ?? 0
                )}
              </div>
              <p className="text-[0.7rem] text-gold-400/80 font-mono mt-1">
                Awaiting response
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 3. Quick Action Cards (3 Columns) */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono tracking-[0.25em] uppercase text-gold-400">
          ✦ QUICK ACTIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Upload Photos */}
          <Link href="/gallery/photos" className="block">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/80 bg-card/70 backdrop-blur-md hover:border-gold-400/50 hover:bg-gold-400/[0.03] transition-all duration-300 p-5 cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-lg border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-gold-400 transition-colors">
                      Upload Photos
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Add photos to portfolio categories
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
              </Card>
            </motion.div>
          </Link>

          {/* Action 2: Add Category */}
          <Link href="/gallery/categories" className="block">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/80 bg-card/70 backdrop-blur-md hover:border-gold-400/50 hover:bg-gold-400/[0.03] transition-all duration-300 p-5 cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-lg border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all">
                    <FolderPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-gold-400 transition-colors">
                      Add Category
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Create &amp; organize portfolio categories
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
              </Card>
            </motion.div>
          </Link>

          {/* Action 3: View Leads */}
          <Link href="/leads" className="block">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/80 bg-card/70 backdrop-blur-md hover:border-gold-400/50 hover:bg-gold-400/[0.03] transition-all duration-300 p-5 cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-lg border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all">
                    <MailCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-gold-400 transition-colors">
                      View Leads
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Manage client booking inquiries
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
              </Card>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* 4. Recent Inquiries Section */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-lg font-light tracking-wide font-serif uppercase">
              Recent Client Inquiries
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Latest booking requests received through the studio website
            </CardDescription>
          </div>

          <Link href="/leads">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-gold-400/30 text-gold-400 hover:bg-gold-400/10 hover:border-gold-400"
            >
              <span>View All Leads</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
                      <span>Loading recent inquiries...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !stats || stats.recent_leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No client inquiries received yet.
                  </TableCell>
                </TableRow>
              ) : (
                stats.recent_leads.map((lead) => (
                  <TableRow key={lead.id} className="group">
                    {/* Name & Contact Info */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-foreground group-hover:text-gold-400 transition-colors">
                          {lead.name}
                        </span>
                        <span className="text-[0.7rem] text-muted-foreground font-mono">
                          {lead.phone}
                        </span>
                      </div>
                    </TableCell>

                    {/* Event Type */}
                    <TableCell className="text-xs text-muted-foreground">
                      {lead.event_type}
                    </TableCell>

                    {/* Event Date */}
                    <TableCell className="text-xs font-mono text-foreground/80">
                      {lead.event_date ? lead.event_date : "TBD"}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>{renderStatusBadge(lead.status)}</TableCell>

                    {/* Created Date */}
                    <TableCell className="text-xs text-muted-foreground/70 font-mono">
                      {new Date(lead.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-emerald-400 transition-colors"
                          title="Contact on WhatsApp"
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                        </a>
                        <Link
                          href="/leads"
                          className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-gold-400 transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
