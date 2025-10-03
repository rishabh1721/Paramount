"use client";
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useEffect, useState } from 'react';
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { 
  RenderEmptyState, 
  RenderErrorState, 
  RenderUploadingState, 
  RenderUploadedState 
} from './RenderState';
import { toast } from 'sonner';
import { useConstructUrl } from '@/hooks/use-construct-url';

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface UploaderProps {
  onChange?: (key: string) => void;
  value?: string;
}

export function Uploader({ onChange, value }: UploaderProps) {
  const fileUrl = useConstructUrl(value || "")
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    objectUrl: undefined,
    key: undefined,
  });

  // Initialize state from value prop (for edit forms)
  useEffect(() => {
    if (value && fileUrl) {
      setFileState((prev) => ({
        ...prev,
        key: value,
        objectUrl: fileUrl,
        error: false,
      }));
    }
  }, [value, fileUrl]);

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const preSignedResponse = await fetch('/api/s3/upload', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: file.type.startsWith('image/'),
        }),
      });

      if (!preSignedResponse.ok) {
        const errorData = await preSignedResponse.json();
        console.error('Presigned URL error:', errorData);
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { presignedUrl, key } = await preSignedResponse.json();
      console.log('Got presigned URL, uploading file...');

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted),
            }));
          }
        };

        xhr.onload = () => {
          console.log('Upload status:', xhr.status);
          
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
              error: false,
            }));
            
            if (onChange) {
              onChange(key);
            }
            
            toast.success("File uploaded successfully");
            resolve();
          } else {
            console.error('Upload failed:', xhr.status, xhr.responseText);
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.error('XHR error during upload');
          reject(new Error('Network error during upload'));
        };

        xhr.open("PUT", presignedUrl);
        xhr.send(file);
      });

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Revoke previous object URL to prevent memory leaks
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      
      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: file.type.startsWith('image/') ? "image" : "video",
      });
      
      uploadFile(file);
    }
  }, [fileState.objectUrl]);

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.key) return;
    
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to delete file from storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
        return;
      }

      // Revoke object URL
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      // Reset state
      setFileState({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: "image",
        id: null,
        isDeleting: false,
        key: undefined,
      });

      // Clear form value
      if (onChange) {
        onChange('');
      }

      toast.success("File removed successfully");

    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Error removing file. Please try again!");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find((rejection) => 
        rejection.errors[0].code === "too-many-files"
      );

      const fileSizeToBig = fileRejection.find((rejection) => 
        rejection.errors[0].code === "file-too-large"
      );

      if (fileSizeToBig) {
        toast.error("File size exceeds the limit (5MB max)");
      }
      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || fileState.isDeleting,
  });

  function renderContent() {
    // Show uploading state with progress
    if (fileState.uploading) {
      return (
        <RenderUploadingState 
          file={fileState.file as File} 
          progress={fileState.progress} 
        />
      );
    }

    // Show error state
    if (fileState.error) {
      return <RenderErrorState />;
    }

    // Show uploaded file with remove option
    if (fileState.objectUrl && fileState.key && !fileState.uploading) {
      return (
        <RenderUploadedState 
          fileUrl={fileState.objectUrl}
          fileName={fileState.file?.name || "Uploaded file"}
          onRemove={handleRemoveFile}
        />
      );
    }

    // Show empty state (drag and drop area)
    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <Card 
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 cursor-pointer", 
        isDragActive && 'border-primary bg-primary/10 border-solid',
        (fileState.uploading || fileState.isDeleting) && 'pointer-events-none opacity-70',
        fileState.objectUrl && fileState.key && 'border-solid border-primary/50'
      )}
    >
      <CardContent className='flex items-center justify-center h-full w-full p-4'>
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
