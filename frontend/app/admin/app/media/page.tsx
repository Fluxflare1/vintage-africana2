import { adminMedia } from "@/lib/admin-api";

export default async function AdminMedia() {
  const assets = await adminMedia.list();

  return (
    <>
      <h1>Media Library</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {assets.map((a) => (
          <img key={a.id} src={a.url} alt="" style={{ width: "100%" }} />
        ))}
      </div>
    </>
  );
}
