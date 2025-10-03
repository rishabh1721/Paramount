import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, XIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
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
  isDeleting = false 
}: { 
  fileUrl: string; 
  fileName?: string;
  onRemove?: () => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="text-center w-full h-full flex flex-col items-center justify-center relative">
      {/* Display uploaded image */}
      <div className={cn(
        "relative",
        isDeleting && "opacity-50"
      )}>
        <img 
          src={fileUrl} 
          alt="Uploaded file" 
          className="max-h-48 max-w-full object-contain mx-auto rounded mb-3"
        />
        
        {/* Deleting overlay */}
        {isDeleting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Loader2Icon className="size-6 text-destructive animate-spin" />
            </div>
          </div>
        )}
      </div>
      
      {/* Success indicator */}
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2Icon className="size-5" />
        <p className="text-sm font-medium">
          {isDeleting ? "Deleting..." : "Upload successful"}
        </p>
      </div>
      
      {/* File name if provided */}
      {fileName && (
        <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
          {fileName}
        </p>
      )}
      
      {/* Delete button with loader */}
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
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
