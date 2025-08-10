import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { FileUp } from "lucide-react";
import { toast } from "sonner";

const { useUploadThing: useUT } = generateReactHelpers<OurFileRouter>();

export default function Uploadimage({
  onUpload,
  disable = false,
}: {
  onUpload: (url: string) => void;
  disable: boolean;
}) {
  const { startUpload, isUploading } = useUT("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]?.url) {
        toast.success("Image uploaded!");
        onUpload(res[0].url);
      }
    },
    onUploadError: (err) => {
      toast.error(`Upload failed: ${err.message}`);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disable) return;
    const files = e.target.files;
    if (files) await startUpload(Array.from(files));
  };

  return (
    <label className="cursor-pointer inline-flex items-center gap-2 bg-[#191538] text-sm  text-white p-2 rounded">
      <FileUp className="size-4" />
      {isUploading ? "Uploading..." : "Upload  Image"}
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        disabled={disable}
      />
    </label>
  );
}
