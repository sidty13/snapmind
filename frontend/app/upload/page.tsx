"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [predictedCategory, setPredictedCategory] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setStatus("Uploading...");

      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setUploadProgress(percent);
            }
          },
        }
      );

      const result = response.data;
      setCaption(result.caption);
      setPredictedCategory(result.category);
      setStatus("✅ Review generated!");
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("❌ Upload failed. Check backend connection.");
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-200"
      >
        {/* Title */}
        <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
          SnapMind Auto Review
        </h1>

        <div className="space-y-5">
          {/* File Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 font-semibold">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Upload Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isUploading}
            onClick={handleUpload}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Generate Review"}
          </motion.button>

          {/* Progress Bar */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Vertical Review Card */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="mt-8 flex flex-col items-center bg-gray-50 rounded-2xl shadow-inner border border-gray-200 p-5"
          >
            <p className="text-sm text-gray-600 mb-3">{status}</p>

            {previewUrl && (
              <motion.img
                src={previewUrl}
                alt="Uploaded Preview"
                className="w-full max-h-72 object-cover rounded-xl shadow-lg mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}

            {predictedCategory && (
              <h2 className="text-lg font-bold text-indigo-600 mb-2">
                {predictedCategory === "Other"
                  ? "Different Category"
                  : `${predictedCategory} Review`}
              </h2>
            )}

            {caption && (
              <p className="text-gray-700 font-medium text-base italic bg-white px-4 py-3 rounded-lg shadow">
                “{caption}”
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
