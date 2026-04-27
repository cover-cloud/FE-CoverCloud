"use client";

import { useRef } from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "swiper/css";
import "swiper/css/pagination";
import theme from "@/app/lib/theme";
import PostBasicButton from "@/components/PostBasicButton";
import { useMediaQuery } from "@mui/material";

const banners = [
  {
    title: "좋아하는 커버곡을 공유하고\n새로운 커버곡을 발견해보세요.",
    titleFontSize: "32px",
    buttonText: "이용 가이드 확인하기",
    mobileButtonText: "가이드 확인하기",
    buttonLink:
      "https://fanatical-maple-fe1.notion.site/covercloud-34b9f9489f1580cf8fd3db684eb0966e",
    image: "/asset/image/bannerGuide.png",
    backgroundColor: "#D4D5F5",
    buttonColor: theme.palette.purple.primary,
    buttonHoverColor: theme.palette.purple.secondary,

    mobileScale: 0.55,
    mobileRight: "-45px",
  },
  {
    title: "커버클라우드, 어떠셨나요?",
    titleFontSize: "36px",
    subTitle: "더 좋은 서비스를 위해\n여러분의 의견을 들려주세요.",
    buttonText: "설문 참여하기",
    mobileButtonText: "설문 참여하기",
    buttonLink: "https://forms.gle/tkzk8Qk9n6JYMoav6",
    image: "/asset/image/banner.png",
    backgroundColor: "#FEE9E7",
    buttonColor: theme.palette.orange.primary,
    buttonHoverColor: theme.palette.orange.secondary,
    mobileScale: 0.8,
    mobileRight: "-10px",
  },
];

export default function MainBanner() {
  const swiperRef = useRef<SwiperType | null>(null);
  const isMobile = useMediaQuery("(max-width: 1176px)");

  return (
    <Box sx={{ width: "100%", overflow: "hidden", position: "relative" }}>
      <Swiper
        modules={[Pagination]}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".main-banner-pagination" }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.title}>
            <Box
              sx={{
                backgroundColor: banner.backgroundColor,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                height: "170px",
                gap: "70px",
                minWidth: "896px",

                "@media (max-width: 1176px)": {
                  padding: "10px 0 10px 30px",
                  height: "170px",
                  gap: "12px",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  minWidth: "unset",
                },
              }}
            >
              {/* 이미지 */}
              <Box
                sx={{
                  flexShrink: 0,
                  transform: "scale(1.2)",

                  "@media (max-width: 1176px)": {
                    position: "absolute",
                    bottom: "13px",
                    right: "48px",
                    transform: "scale(1)",
                  },
                  "@media (max-width: 534px)": {
                    transform: `scale(${banner.mobileScale})`,
                    right: banner.mobileRight,
                  },
                }}
              >
                <img src={banner.image} alt="" />
              </Box>

              {/* 텍스트 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    whiteSpace: "pre-line",
                    fontWeight: 700,
                    fontSize: banner.titleFontSize,

                    "@media (max-width: 768px)": {
                      fontSize: "23px",
                    },
                  }}
                >
                  {banner.title}
                </Box>
                {banner.subTitle && (
                  <Box
                    sx={{
                      whiteSpace: "normal",
                      "@media (max-width: 1176px)": {
                        whiteSpace: "pre-line",
                      },
                      "@media (max-width: 768px)": {
                        fontSize: "14px",
                      },
                    }}
                  >
                    {banner.subTitle}
                  </Box>
                )}
              </Box>

              {/* 버튼 */}
              <Box sx={{ flexShrink: 0, zIndex: 1 }}>
                <Link
                  href={banner.buttonLink}
                  target={
                    banner.buttonLink.startsWith("http") ? "_blank" : undefined
                  }
                >
                  <PostBasicButton
                    onClick={() => {}}
                    backgroundColor={banner.buttonColor}
                    hoverBGColor={banner.buttonHoverColor}
                    color="white"
                    sxStyle={{
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    {isMobile ? banner.mobileButtonText : banner.buttonText}
                  </PostBasicButton>
                </Link>
              </Box>
            </Box>
          </SwiperSlide>
        ))}

        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <Box
            className="main-banner-pagination"
            sx={{ display: "flex", gap: "6px" }}
          />
        </Box>
        {(["left", "right"] as const).map((side) => (
          <Box
            key={side}
            onClick={() =>
              side === "left"
                ? swiperRef.current?.slidePrev()
                : swiperRef.current?.slideNext()
            }
            sx={{
              position: "absolute",
              [side]: 0,
              top: 0,
              width: "8%",
              height: "100%",
              zIndex: 5,
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              // 버튼 원 자체를 opacity로 제어
              "& .arrow-btn": {
                opacity: 0,
                transition: "all 0.2s ease",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              "&:hover .arrow-btn": {
                opacity: 1,
              },
            }}
          >
            <Box className="arrow-btn">
              {side === "left" ? (
                <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "white" }} />
              ) : (
                <ArrowForwardIosIcon sx={{ fontSize: 18, color: "white" }} />
              )}
            </Box>
          </Box>
        ))}
      </Swiper>
    </Box>
  );
}
