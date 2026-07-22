"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Eye,
  X,
  CheckCircle2,
  Sparkles,
  FolderTree,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";

import {
  getCategories,
  getPhotos,
  createPhoto,
  deletePhoto,
  setCoverPhoto,
  reorderPhotos,
  uploadImage,
  Photo,
  Category,
} from "@/lib/api";


export default function PhotosPage() {
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<
    { file: File; preview: string; progress: number }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox Modal & Delete Modal State
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);

  // Load Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategoryId(cats[0].id);
        }
      } catch (err: any) {
        toast({
          title: "Error Loading Categories",
          description: err.message || "Failed to load categories.",
          variant: "error",
        });
      }
    };

    fetchCategories();
  }, []);

  // Load Photos whenever selectedCategoryId changes
  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const data = await getPhotos(selectedCategoryId);
        setPhotos(data);
      } catch (err: any) {
        toast({
          title: "Error Loading Photos",
          description: err.message || "Failed to fetch photos.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedCategoryId]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Handle Drag & Drop / File Selection for Upload
  const handleFilesAdded = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newEntries = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));

    setUploadFiles((prev) => [...prev, ...newEntries]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleRemoveUploadFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Perform Upload to Backend API
  const handleStartUpload = async () => {
    if (uploadFiles.length === 0 || !selectedCategoryId) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < uploadFiles.length; i++) {
        // Upload image to Cloudinary via backend API
        const uploadRes = await uploadImage(uploadFiles[i].file);

        // Update upload progress
        setUploadFiles((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, progress: 100 } : item))
        );

        // Save Photo record with real Cloudinary secure_url
        await createPhoto({
          category_id: selectedCategoryId,
          image_url: uploadRes.secure_url,
          display_order: photos.length + i + 1,
          is_cover: photos.length === 0 && i === 0,
          is_published: true,
        });
      }

      toast({
        title: "Photos Uploaded Successfully",
        description: `Added ${uploadFiles.length} photo(s) to "${selectedCategory?.name}".`,
        variant: "success",
      });

      // Reload photos
      const updatedPhotos = await getPhotos(selectedCategoryId);
      setPhotos(updatedPhotos);

      setUploadFiles([]);
      setIsUploadOpen(false);
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to save photos.",
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };


  // Set Cover Photo
  const handleSetCover = async (photo: Photo) => {
    try {
      await setCoverPhoto(photo.id);
      setPhotos((prev) =>
        prev.map((p) => ({
          ...p,
          is_cover: p.id === photo.id,
        }))
      );
      toast({
        title: "Cover Photo Set",
        description: `Set photo #${photo.id} as cover for "${selectedCategory?.name}".`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Cover Update Failed",
        description: err.message || "Failed to set cover photo.",
        variant: "error",
      });
    }
  };

  // Confirm Delete Photo
  const handleConfirmDelete = async () => {
    if (!deletingPhoto || !selectedCategoryId) return;

    try {
      await deletePhoto(deletingPhoto.id);
      const updatedPhotos = await getPhotos(selectedCategoryId);
      setPhotos(updatedPhotos);

      toast({
        title: "Photo Deleted",
        description: "Photo record removed from gallery.",
        variant: "info",
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Failed to delete photo.",
        variant: "error",
      });
    } finally {
      setDeletingPhoto(null);
    }
  };

  // Move Order
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === photos.length - 1)
    ) {
      return;
    }

    const updated = [...photos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((item, i) => ({
      ...item,
      display_order: i + 1,
    }));

    setPhotos(reordered);

    try {
      await reorderPhotos(
        reordered.map((p) => ({ id: p.id, display_order: p.display_order }))
      );
      toast({
        title: "Order Updated",
        description: "Photo display order synced.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Reorder Failed",
        description: err.message || "Failed to sync photo order.",
        variant: "error",
      });
      if (selectedCategoryId) {
        const fresh = await getPhotos(selectedCategoryId);
        setPhotos(fresh);
      }
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Page Header & Category Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif uppercase text-foreground">
              Gallery Photos
            </h1>
            <Badge variant="gold">
              {photos.length} Photos in Category
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage portfolio photo records, cover assignments &amp; display order
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Dropdown Selector */}
          <Select
            value={selectedCategoryId?.toString() || ""}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            className="w-48 bg-card border-border text-xs"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.photo_count})
              </option>
            ))}
          </Select>

          <Button
            onClick={() => setIsUploadOpen(true)}
            className="bg-gold-400 text-black hover:bg-gold-300 transition-colors flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Photos</span>
          </Button>
        </div>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            <p className="text-xs text-muted-foreground font-mono">
              Loading category photos...
            </p>
          </div>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/80 rounded-xl bg-card/40">
          <Camera className="h-10 w-10 mx-auto text-gold-400/60 mb-3" />
          <h3 className="text-base font-medium text-foreground">No Photos in Category</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Upload photos to "{selectedCategory?.name || "Selected Category"}" to build your portfolio.
          </p>
          <Button
            onClick={() => setIsUploadOpen(true)}
            size="sm"
            className="mt-4 bg-gold-400 text-black hover:bg-gold-300"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Upload First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/80 bg-card/60 backdrop-blur-md overflow-hidden hover:border-gold-400/40 transition-all duration-300 group relative">
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full bg-black/60 overflow-hidden">
                    <Image
                      src={photo.image_url}
                      alt={`Photo ${photo.id}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Cover Star Badge */}
                    {photo.is_cover && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-gold-400 text-black text-[0.65rem] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg z-10">
                        <Star className="h-3 w-3 fill-black" />
                        <span>Category Cover</span>
                      </div>
                    )}

                    {/* Order Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 border border-border text-[0.65rem] font-mono text-muted-foreground backdrop-blur-md">
                      #{photo.display_order}
                    </div>

                    {/* Hover Overlay Toolbar */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-3">
                      {/* Set Cover Button */}
                      {!photo.is_cover && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleSetCover(photo)}
                          className="h-8 w-8 rounded-full border-gold-400/50 bg-black/60 text-gold-400 hover:bg-gold-400 hover:text-black transition-all"
                          title="Set as Category Cover"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Lightbox Preview */}
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setPreviewPhoto(photo)}
                        className="h-8 w-8 rounded-full border-white/30 bg-black/60 text-white hover:bg-white hover:text-black transition-all"
                        title="View Lightbox"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingPhoto(photo)}
                        className="h-8 w-8 rounded-full text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                        title="Delete Photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Reorder Buttons Footer */}
                  <CardContent className="p-2.5 flex items-center justify-between bg-card/80 border-t border-border/60">
                    <span className="text-[0.7rem] font-mono text-muted-foreground">
                      ID #{photo.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === 0}
                        onClick={() => handleMoveOrder(idx, "up")}
                        className="h-7 w-7 text-muted-foreground hover:text-gold-400 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === photos.length - 1}
                        onClick={() => handleMoveOrder(idx, "down")}
                        className="h-7 w-7 text-muted-foreground hover:text-gold-400 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Multi-Photo Upload Dialog Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
          <DialogDescription>
            Add new photos to category &quot;{selectedCategory?.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/80 hover:border-gold-400/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-black/40"
          >
            <Upload className="h-10 w-10 mx-auto text-gold-400 mb-2" />
            <p className="text-sm font-medium text-foreground">
              Drag &amp; drop images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports JPEG, PNG, WebP up to 10MB per photo
            </p>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
            />
          </div>

          {/* Staged Upload Previews Grid */}
          {uploadFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-muted-foreground">
                Staged Photos ({uploadFiles.length})
              </span>
              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-1">
                {uploadFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-md overflow-hidden border border-border bg-black group"
                  >
                    <Image
                      src={item.preview}
                      alt="Upload preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveUploadFile(idx)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/80 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={uploadFiles.length === 0 || isUploading}
              onClick={handleStartUpload}
              className="bg-gold-400 text-black hover:bg-gold-300"
            >
              {isUploading ? "Uploading..." : `Upload ${uploadFiles.length} Photos`}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Lightbox Preview Dialog */}
      <Dialog open={Boolean(previewPhoto)} onOpenChange={(open) => !open && setPreviewPhoto(null)}>
        <DialogHeader className="sr-only">
          <DialogTitle>Photo Preview</DialogTitle>
          <DialogDescription>Full-size lightbox view</DialogDescription>
        </DialogHeader>
        {previewPhoto && (
          <div className="relative w-full max-w-4xl mx-auto h-[75vh] flex items-center justify-center p-2">
            <Image
              src={previewPhoto.image_url}
              alt={`Photo ${previewPhoto.id}`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deletingPhoto)}
        onOpenChange={(open) => !open && setDeletingPhoto(null)}
        title="Delete Photo?"
        description="Are you sure you want to delete this photo record? If this was the category cover image, a new cover photo will be auto-promoted."
        confirmLabel="Delete Photo"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}
