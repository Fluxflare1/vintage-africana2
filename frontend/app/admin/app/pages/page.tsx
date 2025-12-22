import { adminPages } from "@/lib/admin-api";

export default async function AdminPages() {
  const pages = await adminPages.list();

  return (
    <>
      <h1>Pages</h1>
      <a href="/admin/app/pages/new">+ New Page</a>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.slug}>
              <td>
                <a href={`/admin/app/pages/${p.slug}`}>{p.title}</a>
              </td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
