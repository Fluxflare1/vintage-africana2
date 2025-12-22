type StatusBarProps = {
  status: "draft" | "review" | "published" | "archived";
  setStatus: (value: "draft" | "review" | "published" | "archived") => void;
  disabled?: boolean;
};

export default function StatusBar({ status, setStatus, disabled = false }: StatusBarProps) {
  return (
    <div className="flex items-center gap-3 border-b pb-3">
      <span className="text-sm font-medium">Status:</span>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as StatusBarProps["status"])}
        disabled={disabled}
        className="border px-3 py-1 rounded bg-white disabled:opacity-60"
      >
        <option value="draft">Draft</option>
        <option value="review">Review</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
}
