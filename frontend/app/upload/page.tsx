"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const categories = ["Food", "Pet", "Nature", "Art", "Fashion"];

export default function UploadPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleUpload = async () => {
    if (!file || !selectedCategory) {
      alert("Please select a category and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", selectedCategory);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setUploadProgress(percent);
            }
          },
        }
      );

      const result = response.data;
      setUploadedImageUrl(result.processed_image);
      setCaption(result.caption);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check backend connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white max-w-md w-full rounded-xl p-8 shadow-lg border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload Image for AI Review
        </h1>

        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}

          {/* Upload Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isUploading}
            onClick={handleUpload}
            className={`w-full text-white font-semibold py-3 rounded-lg transition ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </motion.button>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Uploaded Result */}
        {uploadedImageUrl && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Processed Image:
            </p>
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="w-full rounded-md border"
            />
            {caption && (
              <p className="text-gray-600 text-center mt-2 italic">
                Caption: {caption}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </main>
  );
}
