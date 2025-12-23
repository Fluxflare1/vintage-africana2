"use client";

import StatusBar from "@/components/admin/StatusBar";
import { useState } from "react";

type PageStatus = "draft" | "review" | "published" | "archived";

export default function PageEditor() {
  const [page, setPage] = useState<{ status: PageStatus }>({
    status: "draft",
  });

  return (
    <>
      <StatusBar
        status={page.status}
        setStatus={(v: PageStatus) => setPage({ ...page, status: v })}
      />
    </>
  );
}
