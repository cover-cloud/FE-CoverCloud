import React from "react";
import Box from "@mui/material/Box";
import Link from "next/link";
import theme from "@/app/lib/theme";
const Footer = () => {
  const footerLink = [
    {
      label: "개인정보 처리방침",
      href: "https://fanatical-maple-fe1.notion.site/2e09f9489f15805880fee726d4a75f60",
    },
    {
      label: "이용약관",
      href: "https://fanatical-maple-fe1.notion.site/2e09f9489f158051a750c6300645ac75",
    },
    {
      label: "공지사항",
      href: "https://fanatical-maple-fe1.notion.site/2e79f9489f1580aea557c44783355b28",
    },
    { label: "문의하기", href: "https://forms.gle/z3GM4R86hk1SsB6P8" },
  ];
  return (
    <Box className="max-w-7xl mx-auto py-8 px-4 sx:px-6 md:px-12">
      <Box>
        <Box
          className="flex"
          sx={{ gap: "42px", mb: "16px", fontSize: "15px", fontWeight: "bold" }}
        >
          {footerLink.map((link) => (
            <Link key={link.label} href={link.href} target="_blank">
              {link.label}
            </Link>
          ))}
        </Box>
        <Box className="C3" sx={{ color: "#828282" }}>
          <Box>문의 : covercloudofficial@gmail.com</Box>
          <Box>Copyright 2026 covercloud. All rights reserved.</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
