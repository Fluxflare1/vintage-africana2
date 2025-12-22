export default async function Versions({ params }: any) {
  const res = await fetch(
    `/api/versions/${params.entity}/${params.id}/`,
    { cache: "no-store" }
  );
  const versions = await res.json();

  return (
    <>
      <h1>Versions</h1>
      {versions.map((v: any) => (
        <pre key={v.id}>{JSON.stringify(v.payload, null, 2)}</pre>
      ))}
    </>
  );
}
