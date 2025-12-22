export default function SEOFields({ value, onChange }: any) {
  return (
    <>
      <input
        placeholder="SEO Title"
        value={value.seo_title || ""}
        onChange={(e) => onChange({ ...value, seo_title: e.target.value })}
      />
      <textarea
        placeholder="Meta Description"
        value={value.seo_description || ""}
        onChange={(e) => onChange({ ...value, seo_description: e.target.value })}
      />
    </>
  );
}
