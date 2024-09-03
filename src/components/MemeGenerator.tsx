"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";

const MemeGenerator: React.FC = () => {
  const [topText, setTopText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportMeme = () => {
    const node = document.getElementById("meme");
    if (node) {
      import("html-to-image").then((module) => {
        module
          .toPng(node)
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "meme.png";
            link.click();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto to shrink the textarea when deleting text
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight to expand based on content
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Adjust height on initial render
  }, [topText]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="image">Image</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {image && (
        <div
          id="meme"
          className="w-full max-w-md ring ring-slate-400/10 rounded-lg"
        >
          <div className="bg-white p-2 rounded-t-lg text-center">
            <textarea
              ref={textareaRef}
              placeholder="Enter text..."
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              rows={1}
              className="w-full flex items-center bg-transparent text-black font-mono font-light text-xl text-left resize-none overflow-hidden"
            />
          </div>
          <div className="relative">
            <img
              src={image}
              alt="Meme"
              className="w-full object-cover rounded-b-lg overflow-hidden"
            />
          </div>
        </div>
      )}
      {image && (
        <Button variant="outline" onClick={exportMeme}>
          Export Meme
        </Button>
      )}
      {!image && <p>Choose image to being making meme...</p>}
    </div>
  );
};

export default MemeGenerator;
