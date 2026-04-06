"use client";

import { useEffect, useState } from "react";
import { MdBuildCircle } from "react-icons/md";
import theme from "@/app/lib/theme";

const MaintenanceModal = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          width: "360px",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <MdBuildCircle size={56} color={theme.palette.orange.primary} />
        <p style={{ fontWeight: 700, fontSize: "20px", margin: 0 }}>
          서버 점검 중
        </p>
        <p
          style={{
            color: "#666",
            fontSize: "15px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          현재 서버 점검 중입니다.
          <br />
          잠시 후 다시 이용해 주세요.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceModal;
