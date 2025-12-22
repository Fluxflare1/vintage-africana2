export default function StatusBar({ status, setStatus }: any) {
  return (
    <select value={status} onChange={(e) => setStatus(e.target.value)}>
      <option value="draft">Draft</option>
      <option value="review">Review</option>
      <option value="published">Published</option>
    </select>
  );
}
