"use client";

import axios from "axios";
import { ArrowUp, ImagePlus, User, X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { RunStatus } from "@/service/GlobalApi";
import ThumbnailList from "./_components/ThumbnailList";

function AIThumbnailGenerator() {
  const [userInput, setUserInput] = useState<string>("");
  const [referanceImage, setReferanceImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [referanceImagePreview, setReferanceImagePreview] = useState<string>("");
  const [faceImagePreview, setFaceImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [outputThumbnailImage, setOutputThumbnailImage] = useState<string>("");

  const onHandFileChange = (
    field: "referanceImage" | "faceImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);

    if (field === "referanceImage") {
      setReferanceImage(selectedFile);
      setReferanceImagePreview(objectUrl);
    } else {
      setFaceImage(selectedFile);
      setFaceImagePreview(objectUrl);
    }
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      referanceImagePreview && URL.revokeObjectURL(referanceImagePreview);
      faceImagePreview && URL.revokeObjectURL(faceImagePreview);
    };
  }, [referanceImagePreview, faceImagePreview]);

  const onSubmit = async () => {
    if (!userInput && !referanceImage && !faceImage) {
      alert("Please provide input or upload images.");
      return;
    }

    try {
      setLoading(true);
      setOutputThumbnailImage("");

      const formData = new FormData();
      userInput && formData.append("userInput", userInput);
      referanceImage && formData.append("refImage", referanceImage);
      faceImage && formData.append("faceImage", faceImage);

      const result = await axios.post("/api/generate-thumbnail", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const runId = result.data.runId;
      if (!runId) throw new Error("No runId returned from API");

      // Polling Inngest run status
      while (true) {
        const runStatus = await RunStatus(runId);
        if (!runStatus) break;

        if (runStatus.status === "Completed") {
          setOutputThumbnailImage(runStatus.output); // assuming output is a URL string
          break;
        }

        if (runStatus.status === "Cancelled" || runStatus.status === "Failed") {
          alert("Thumbnail generation was cancelled or failed.");
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (err: any) {
      console.error("API error:", err.response?.data || err.message);
      alert(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="px-10 md:px-20 lg:px-40">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <h2 className="font-bold text-4xl">AI Thumbnail Generator</h2>
          <p className="text-gray-400 text-center">
            Turn any video into a click magnet with thumbnails that grab attention
            and drive views. Our AI Youtube thumbnail maker creates professional
            designs instantly — no design skill needed.
          </p>
        </div>

        {/* Output / Loader */}
        <div className="mt-6 w-full">
          {loading ? (
            <div className="w-full bg-secondary border rounded-2xl p-10 h-[250px] flex items-center justify-center gap-4">
              <Loader2 className="animate-spin" />
              <h2>Please wait... Thumbnail is generating</h2>
            </div>
          ) : (
            outputThumbnailImage && (
              <Image
                src={outputThumbnailImage}
                alt="Thumbnail"
                width={500}
                height={400}
                className="aspect-video w-full"
              />
            )
          )}
        </div>

        {/* Input Section */}
        <div className="flex gap-5 items-center p-5 border rounded-xl mt-10 bg-secondary">
          <textarea
            placeholder="Enter your YouTube video title or description"
            className="w-full outline-0 bg-transparent"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div
            className="p-3 bg-gradient-to-t from-red-500 to-orange-500 rounded-full cursor-pointer"
            onClick={onSubmit}
          >
            <ArrowUp />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mt-3 flex gap-3">
          {/* Reference Image */}
          <label htmlFor="referanceImageUpload" className="w-full cursor-pointer">
            {!referanceImagePreview ? (
              <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all">
                <ImagePlus />
                <h2>Reference Image</h2>
              </div>
            ) : (
              <div className="relative">
                <X
                  className="absolute top-1 right-1 cursor-pointer"
                  onClick={() => setReferanceImagePreview("")}
                />
                <Image
                  src={referanceImagePreview}
                  alt="Reference Image"
                  width={100}
                  height={100}
                  className="w-[70px] h-[70px] object-cover rounded-sm"
                />
              </div>
            )}
          </label>
          <input
            type="file"
            id="referanceImageUpload"
            className="hidden"
            onChange={(e) => onHandFileChange("referanceImage", e)}
          />

          {/* Face Image */}
          <label htmlFor="IncludeFace" className="w-full cursor-pointer">
            {!faceImagePreview ? (
              <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all">
                <User />
                <h2>Include Face</h2>
              </div>
            ) : (
              <div className="relative">
                <X
                  className="absolute top-1 right-1 cursor-pointer"
                  onClick={() => setFaceImagePreview("")}
                />
                <Image
                  src={faceImagePreview}
                  alt="Face Image"
                  width={100}
                  height={100}
                  className="w-[70px] h-[70px] object-cover rounded-sm"
                />
              </div>
            )}
          </label>
          <input
            type="file"
            id="IncludeFace"
            className="hidden"
            onChange={(e) => onHandFileChange("faceImage", e)}
          />
        </div>
      </div>

      {/* Thumbnail List */}
      <ThumbnailList />
    </div>
  );
}

export default AIThumbnailGenerator;
