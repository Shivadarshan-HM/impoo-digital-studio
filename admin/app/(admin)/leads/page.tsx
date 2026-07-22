"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  PhoneCall,
  Mail,
  Calendar,
  MessageSquare,
  Trash2,
  Eye,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Sheet } from "@/components/ui/sheet";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";
import { getLeads, updateLeadStatus, deleteLead, Lead, LeadStatus } from "@/lib/api";

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selection & Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Fetch Leads from Backend API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads({
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? (statusFilter as LeadStatus) : undefined,
        page: currentPage,
        limit: pageSize,
      });
      setLeads(data.items);
      setTotalLeads(data.total);
    } catch (err: any) {
      toast({
        title: "Error Loading Leads",
        description: err.message || "Failed to fetch client inquiries.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchQuery, statusFilter, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));

  // Change Status Handler
  const handleStatusChange = async (leadId: number, newStatus: LeadStatus) => {
    try {
      const updated = await updateLeadStatus(leadId, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
      toast({
        title: "Status Updated",
        description: `Lead status changed to "${newStatus}".`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update lead status.",
        variant: "error",
      });
    }
  };

  // Confirm Delete Lead Handler
  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    const leadName = deletingLead.name;

    try {
      await deleteLead(deletingLead.id);
      toast({
        title: "Lead Removed",
        description: `Inquiry from "${leadName}" deleted.`,
        variant: "info",
      });
      if (selectedLead && selectedLead.id === deletingLead.id) {
        setSelectedLead(null);
      }
      fetchLeads();
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Failed to delete lead.",
        variant: "error",
      });
    } finally {
      setDeletingLead(null);
    }
  };

  // Copy to Clipboard Helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied to Clipboard",
      description: `${field} copied to clipboard.`,
      variant: "success",
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Render Status Badge
  const renderStatusBadge = (status: LeadStatus) => {
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

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif uppercase text-foreground">
              Inquiries &amp; Client Leads
            </h1>
            <Badge variant="gold">
              {totalLeads} Total Inquiries
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage booking requests, filter by status, and contact prospective clients
          </p>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 p-4 rounded-xl border border-border/80 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or phone..."
            className="pl-9 bg-black/50 border-border/70 text-xs focus-visible:border-gold-400"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gold-400 shrink-0" />
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-48 bg-black/50 border-border text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="new">New Inquiries</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Booked / Closed</option>
          </Select>
        </div>
      </div>

      {/* Leads Table */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
                      <span>Loading client inquiries...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No leads found matching query.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="group hover:bg-white/[0.02]">
                    {/* Client Name & Contact Info */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-foreground group-hover:text-gold-400 transition-colors font-medium">
                          {lead.name}
                        </span>
                        <span className="text-[0.7rem] text-muted-foreground font-mono">
                          {lead.phone} · {lead.email}
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

                    {/* Status Dropdown Selector */}
                    <TableCell>
                      <Select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value as LeadStatus)
                        }
                        className="h-7 text-xs bg-transparent border-0 focus:ring-0 p-0"
                      >
                        <option value="new">New Inquiry</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Booked / Closed</option>
                      </Select>
                    </TableCell>

                    {/* Received Date */}
                    <TableCell className="text-xs text-muted-foreground/70 font-mono">
                      {new Date(lead.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLead(lead)}
                          className="h-8 w-8 text-muted-foreground hover:text-gold-400"
                          title="View Details Drawer"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-md hover:bg-white/10 text-muted-foreground hover:text-emerald-400 transition-colors"
                          title="WhatsApp Client"
                        >
                          <PhoneCall className="h-4 w-4" />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingLead(lead)}
                          className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground font-mono">
            Showing Page {currentPage} of {totalPages} ({totalLeads} total leads)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="text-xs border-border disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs border-border disabled:opacity-30"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Lead Details Sheet Drawer */}
      <Sheet
        open={Boolean(selectedLead)}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        side="right"
      >
        {selectedLead && (
          <div className="p-6 space-y-6 select-none h-full overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-xl font-light font-serif text-foreground uppercase tracking-wide">
                  Lead Details
                </h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Received {new Date(selectedLead.created_at).toLocaleString()}
                </p>
              </div>
              {renderStatusBadge(selectedLead.status)}
            </div>

            {/* Client Profile */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest uppercase text-gold-400">
                ✦ CLIENT CONTACT INFO
              </h3>

              <div className="p-4 rounded-lg bg-black/40 border border-border/70 space-y-3">
                <div>
                  <label className="text-[0.65rem] font-mono uppercase text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm font-medium text-foreground">{selectedLead.name}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[0.65rem] font-mono uppercase text-muted-foreground">
                      Phone Number
                    </label>
                    <p className="text-xs font-mono text-foreground">{selectedLead.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(selectedLead.phone, "Phone number")}
                    className="h-7 text-xs border border-border hover:border-gold-400"
                  >
                    {copiedField === "Phone number" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[0.65rem] font-mono uppercase text-muted-foreground">
                      Email Address
                    </label>
                    <p className="text-xs font-mono text-foreground">{selectedLead.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(selectedLead.email, "Email address")}
                    className="h-7 text-xs border border-border hover:border-gold-400"
                  >
                    {copiedField === "Email address" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Event Specs */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest uppercase text-gold-400">
                ✦ EVENT SPECIFICATIONS
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black/40 border border-border/70">
                  <label className="text-[0.65rem] font-mono uppercase text-muted-foreground">
                    Event Type
                  </label>
                  <p className="text-xs font-medium text-foreground mt-0.5">
                    {selectedLead.event_type}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-border/70">
                  <label className="text-[0.65rem] font-mono uppercase text-muted-foreground">
                    Target Date
                  </label>
                  <p className="text-xs font-mono text-gold-400 mt-0.5">
                    {selectedLead.event_date ? selectedLead.event_date : "TBD"}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-mono tracking-widest uppercase text-gold-400">
                ✦ CLIENT MESSAGE
              </label>
              <div className="p-4 rounded-lg bg-black/40 border border-border/70 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedLead.message}
              </div>
            </div>

            {/* Status Change Controls */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Update Status
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedLead.status === "new" ? "luxury" : "outline"}
                  onClick={() => handleStatusChange(selectedLead.id, "new")}
                  className="flex-1 text-xs"
                >
                  New
                </Button>
                <Button
                  size="sm"
                  variant={selectedLead.status === "contacted" ? "luxury" : "outline"}
                  onClick={() => handleStatusChange(selectedLead.id, "contacted")}
                  className="flex-1 text-xs"
                >
                  Contacted
                </Button>
                <Button
                  size="sm"
                  variant={selectedLead.status === "closed" ? "luxury" : "outline"}
                  onClick={() => handleStatusChange(selectedLead.id, "closed")}
                  className="flex-1 text-xs"
                >
                  Closed
                </Button>
              </div>
            </div>
          </div>
        )}
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deletingLead)}
        onOpenChange={(open) => !open && setDeletingLead(null)}
        title={`Delete Inquiry from "${deletingLead?.name}"?`}
        description="Are you sure you want to delete this client lead inquiry? This action cannot be undone."
        confirmLabel="Delete Lead"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}
