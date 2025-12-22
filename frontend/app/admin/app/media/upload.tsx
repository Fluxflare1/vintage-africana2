"use client";

import { uploadMedia } from "@/lib/media-upload";

export default function UploadMedia() {
  async function handle(e: any) {
    const file = e.target.files[0];
    await uploadMedia(file);
    location.reload();
  }

  return <input type="file" onChange={handle} />;
}
