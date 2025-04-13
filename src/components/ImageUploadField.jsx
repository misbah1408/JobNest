'use client';

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const ImageUploadField = ({ form, name = "image", defaultImage }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(defaultImage || null);

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div>
              {/* Clickable Image Preview Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-300 transition"
              >
                {preview ? (
                  preview && <img
                    src={
                      typeof preview === "string"
                        ? preview
                        : URL.createObjectURL(preview)
                    }
                    alt="Click to upload"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500">Click to upload</span>
                )}
              </div>

              {/* Hidden File Input */}
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(file);
                    field.onChange(file);
                  }
                }}
              />
            </div>
          </FormControl>
          <FormLabel className="block mb-2 text-sm font-medium text-gray-700 text-center">
            Profile picture
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
