const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function uploadMedia(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API}/api/media/upload/`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
