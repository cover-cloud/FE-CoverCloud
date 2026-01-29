"use client";
import React, { Suspense } from "react";

export default function ClientOnlyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
