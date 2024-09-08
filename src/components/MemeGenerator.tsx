/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MemeGenerator: React.FC = () => {
  const [topText, setTopText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("meme");
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
            link.download = `${fileName}.png`;
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
    <div className="grid w-full max-w-md items-center gap-1.5">
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
              className="w-full flex items-center bg-transparent text-black font-light text-base text-left resize-none overflow-hidden"
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Export Meme</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Meme</DialogTitle>
              <DialogDescription>
                Choose a file name and the click on save.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="filename" className="sr-only">
                  Link
                </Label>
                <Input
                  id="filename"
                  defaultValue={fileName}
                  type="text"
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <div className="mx-auto w-full grid grid-cols-2 gap-2 items-center">
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    className="w-full"
                    onClick={exportMeme}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {!image && <p>Choose image to begin making meme...</p>}
    </div>
  );
};

export default MemeGenerator;
