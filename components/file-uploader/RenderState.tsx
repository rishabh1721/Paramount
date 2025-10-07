"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, XIcon, CheckCircle2Icon, Loader2Icon, FileVideo } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon 
          className={cn(
            'size-6 text-muted-foreground',
            isDragActive && "text-primary"
          )} 
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or <span className="text-primary font-bold cursor-pointer">click to upload</span>
      </p>
      <Button className="mt-4" type="button">Select file</Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className="size-6 text-destructive" />
      </div>
      <div>
        <p className="text-base font-semibold">Upload Failed</p>
        <p className="text-xs mt-1 text-muted-foreground">
          Something went wrong!
        </p>
        <Button type="button" className="mt-4">Retry File Selection</Button>
      </div>
      <Button 
        variant="destructive" 
        size="icon" 
        className={cn("absolute top-4 right-4")}
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress, 
  file 
}: {
  progress: number; 
  file: File
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <div className="mb-4 w-full max-w-xs">
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-2xl font-bold text-primary">{progress}%</p>
      <p className="mt-2 text-sm font-medium text-foreground">
        Uploading...
      </p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}

export function RenderUploadedState({ 
  fileUrl, 
  fileName,
  onRemove,
  isDeleting = false,
  fileType = "image"
}: { 
  fileUrl: string; 
  fileName?: string;
  onRemove?: () => void;
  isDeleting?: boolean;
  fileType?: "image" | "video";
}) {
  const [videoError, setVideoError] = React.useState(false);
  
  // Define file extensions
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v', '.3gp'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.bmp', '.ico'];
  
  // Check if URL has video extension
  const hasVideoExtension = videoExtensions.some(ext => fileUrl.toLowerCase().includes(ext));
  
  // Check if URL has image extension
  const hasImageExtension = imageExtensions.some(ext => fileUrl.toLowerCase().includes(ext));
  
  // Smart detection: Only show video if fileType is "video" AND no image extension is found
  const isVideo = fileType === "video" && hasVideoExtension && !hasImageExtension;

  return (
    <div className="text-center w-full h-full flex flex-col items-center justify-center relative">
      <div className={cn(
        "relative w-full",
        isDeleting && "opacity-50"
      )}>
        {isVideo ? (
          videoError ? (
            <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg mb-3">
              <FileVideo className="size-16 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-2">Video uploaded successfully</p>
              <p className="text-xs text-muted-foreground mb-3">
                Preview unavailable - Video saved correctly
              </p>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary underline hover:text-primary/80"
                onClick={(e) => e.stopPropagation()}
              >
                Open video in new tab
              </a>
            </div>
          ) : (
            <video 
              key={`video-${fileUrl}`}
              src={fileUrl}
              controls
              controlsList="nodownload"
              className="max-h-48 max-w-full object-contain mx-auto rounded mb-3 bg-black"
              preload="metadata"
              playsInline
              disablePictureInPicture
              poster=""
              crossOrigin="anonymous"
              style={{ 
                display: 'block',
                backgroundColor: '#000'
              }}
              onLoadStart={() => {
                setVideoError(false);
              }}
              onError={(e) => {
                // Only log if it's not a CORS error (which is expected in dev)
                if (e.currentTarget.error?.code !== 4) {
                  console.error('❌ Video load error:', {
                    errorCode: e.currentTarget.error?.code,
                    errorMessage: e.currentTarget.error?.message,
                  });
                }
                setVideoError(true);
              }}
              onCanPlay={() => {
                setVideoError(false);
              }}
            >
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <img 
            key={`image-${fileUrl}`}
            src={fileUrl} 
            alt="Uploaded file" 
            className="max-h-48 max-w-full object-contain mx-auto rounded mb-3"
          />
        )}
        
        {isDeleting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Loader2Icon className="size-6 text-destructive animate-spin" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-green-600">
        {isVideo ? (
          <FileVideo className="size-5" />
        ) : (
          <CheckCircle2Icon className="size-5" />
        )}
        <p className="text-sm font-medium">
          {isDeleting ? "Deleting..." : "Upload successful"}
        </p>
      </div>
      
      {fileName && (
        <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
          {fileName}
        </p>
      )}
      
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={isDeleting}
          className={cn(
            "absolute top-2 right-2",
            "flex items-center justify-center",
            "size-9 rounded-full",
            "bg-red-500 hover:bg-red-600 active:bg-red-700",
            "text-white font-semibold",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "border-2 border-red-400",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            "z-50"
          )}
        >
          {isDeleting ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <XIcon className="size-4" />
          )}
        </button>
      )}
    </div>
  );
}
