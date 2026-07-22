"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Image as ImageIcon,
  FolderPlus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  uploadImage,
  Category,
} from "@/lib/api";

export default function CategoriesPage() {

  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog & Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Form Inputs
  const [formName, setFormName] = useState("");
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formCoverUrl, setFormCoverUrl] = useState<string>("");
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Categories on Mount
  const fetchCategoriesList = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      toast({
        title: "Error Loading Categories",
        description: err.message || "Failed to fetch portfolio categories.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  // Open Create Dialog
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName("");
    setFormOrder(categories.length > 0 ? Math.max(...categories.map((c) => c.display_order)) + 1 : 1);
    setFormCoverUrl("");
    setPreviewFileUrl(null);
    setSelectedCoverFile(null);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormOrder(category.display_order);
    setFormCoverUrl(category.cover_image_url || "");
    setPreviewFileUrl(category.cover_image_url);
    setSelectedCoverFile(null);
    setIsDialogOpen(true);
  };

  // File Upload Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewFileUrl(localUrl);
      setFormCoverUrl(localUrl);
    }
  };

  // Save (Create or Edit) Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name.",
        variant: "error",
      });
      return;
    }

    setSaving(true);

    try {
      let finalCoverUrl = formCoverUrl;

      // If a new cover image file was selected, upload it to Cloudinary first
      if (selectedCoverFile) {
        toast({
          title: "Uploading Image",
          description: "Uploading cover photo to Cloudinary...",
          variant: "info",
        });
        const uploadRes = await uploadImage(selectedCoverFile);
        finalCoverUrl = uploadRes.secure_url;
      }

      if (editingCategory) {
        // Update Category
        const updated = await updateCategory(editingCategory.id, {
          name: formName.trim(),
          display_order: Number(formOrder),
          cover_image_url: finalCoverUrl || editingCategory.cover_image_url,
        });

        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );

        toast({
          title: "Category Updated",
          description: `"${formName.trim()}" has been updated successfully.`,
          variant: "success",
        });
      } else {
        // Create Category
        const newCat = await createCategory({
          name: formName.trim(),
          display_order: Number(formOrder),
          cover_image_url: finalCoverUrl || undefined,
          is_published: true,
        });

        setCategories((prev) => [...prev, newCat]);

        toast({
          title: "Category Created",
          description: `"${formName.trim()}" has been added to portfolio categories.`,
          variant: "success",
        });
      }

      setIsDialogOpen(false);
      setSelectedCoverFile(null);
    } catch (err: any) {
      toast({
        title: "Action Failed",
        description: err.message || "Failed to save category.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };


  // Confirm Delete Category
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    const catName = deletingCategory.name;

    try {
      await deleteCategory(deletingCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      toast({
        title: "Category Removed",
        description: `Category "${catName}" has been deleted.`,
        variant: "info",
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Failed to delete category.",
        variant: "error",
      });
    } finally {
      setDeletingCategory(null);
    }
  };

  // Reorder Category (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === categories.length - 1)
    ) {
      return;
    }

    const updated = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap items
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update display_order property
    const reordered = updated.map((item, i) => ({
      ...item,
      display_order: i + 1,
    }));

    setCategories(reordered);

    try {
      const itemsPayload = reordered.map((c) => ({
        id: c.id,
        display_order: c.display_order,
      }));
      await reorderCategories(itemsPayload);
      toast({
        title: "Order Updated",
        description: `Reordered category "${temp.name}".`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Reorder Failed",
        description: err.message || "Failed to sync category order.",
        variant: "error",
      });
      fetchCategoriesList();
    }
  };

  // Sort by display_order
  const sortedCategories = [...categories].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif uppercase text-foreground">
              Portfolio Categories
            </h1>
            <Badge variant="gold">
              {categories.length} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage portfolio categories, cover images, display order &amp; visibility
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-gold-400 text-black hover:bg-gold-300 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            <p className="text-xs text-muted-foreground font-mono">
              Loading portfolio categories...
            </p>
          </div>
        </div>
      ) : sortedCategories.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/80 rounded-xl bg-card/40">
          <FolderPlus className="h-10 w-10 mx-auto text-gold-400/60 mb-3" />
          <h3 className="text-base font-medium text-foreground">No Categories Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Get started by creating your first portfolio category to showcase photos.
          </p>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="mt-4 bg-gold-400 text-black hover:bg-gold-300"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedCategories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/80 bg-card/70 backdrop-blur-md overflow-hidden hover:border-gold-400/40 transition-all duration-300 group flex flex-col h-full">
                  {/* Category Cover Image Header */}
                  <div className="relative h-44 w-full bg-black/60 overflow-hidden border-b border-border/60">
                    {category.cover_image_url ? (
                      <Image
                        src={category.cover_image_url}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground/50 bg-black/40">
                        <ImageIcon className="h-10 w-10 mb-1" />
                        <span className="text-[0.65rem] font-mono uppercase tracking-wider">
                          No Cover Image
                        </span>
                      </div>
                    )}

                    {/* Order Badge Overlay */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/75 border border-gold-400/30 text-[0.65rem] font-mono text-gold-400 backdrop-blur-md">
                      Order #{category.display_order}
                    </div>

                    {/* Photo Count Badge Overlay */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 border border-border text-[0.65rem] font-mono text-foreground backdrop-blur-md">
                      {category.photo_count} Photos
                    </div>
                  </div>

                  {/* Category Details & Actions */}
                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground group-hover:text-gold-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        Updated {new Date(category.updated_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-4">
                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={idx === 0}
                          onClick={() => handleMoveOrder(idx, "up")}
                          className="h-8 w-8 text-muted-foreground hover:text-gold-400 disabled:opacity-30"
                          title="Move Order Up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={idx === sortedCategories.length - 1}
                          onClick={() => handleMoveOrder(idx, "down")}
                          className="h-8 w-8 text-muted-foreground hover:text-gold-400 disabled:opacity-30"
                          title="Move Order Down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Edit / Delete Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(category)}
                          className="h-8 border-border hover:border-gold-400 text-xs"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingCategory(category)}
                          className="h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Update category title, display order & cover photo"
              : "Create a new category for organizing studio portfolio photos"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveCategory} className="space-y-4 py-2">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Category Name *
            </label>
            <Input
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Pre-Wedding Stories"
              className="bg-black/50 border-border focus-visible:border-gold-400"
            />
          </div>

          {/* Display Order */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Display Order
            </label>
            <Input
              type="number"
              min={1}
              value={formOrder}
              onChange={(e) => setFormOrder(Number(e.target.value))}
              className="bg-black/50 border-border focus-visible:border-gold-400"
            />
          </div>

          {/* Cover Image Preview & File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Cover Image
            </label>
            {previewFileUrl && (
              <div className="relative h-32 w-full rounded-md border border-border overflow-hidden bg-black/40">
                <Image
                  src={previewFileUrl}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-dashed border-border hover:border-gold-400 text-xs flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4 text-gold-400" />
              <span>{previewFileUrl ? "Change Cover Image" : "Upload Cover Image"}</span>
            </Button>
          </div>

          {/* Dialog Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gold-400 text-black hover:bg-gold-300"
            >
              {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title={`Delete "${deletingCategory?.name}"?`}
        description="Are you sure you want to delete this category? All associated photo records will be deleted."
        confirmLabel="Delete Category"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}
