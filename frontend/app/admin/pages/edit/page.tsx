"use client";

import StatusBar from "@/components/admin/StatusBar";
import { useState } from "react";

export default function PageEditor() {
  const [page, setPage] = useState({
    status: "draft",
  });

  return (
    <>
      <StatusBar
        status={page.status}
        setStatus={(v) => setPage({ ...page, status: v })}
      />
    </>
  );
}
