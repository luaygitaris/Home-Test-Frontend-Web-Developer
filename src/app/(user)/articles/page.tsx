"use client";

import ArticlesPage from "@/components/ArticlesContent";
import { Suspense } from "react";

export default function ArticlesPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ArticlesPage />
    </Suspense>
  );
}
