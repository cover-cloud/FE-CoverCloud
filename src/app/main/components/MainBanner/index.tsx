"use client";

import { useRef, useState } from "react";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import "swiper/css";
import "swiper/css/pagination";

import theme from "@/app/lib/theme";
import PostBasicButton from "@/components/PostBasicButton";

const banners = [
  {
    title: "나만의 커버를 공유해보세요",
    description: "좋아하는 음악을 직접 부르고 사람들과 공유할 수 있어요.",
    buttonText: "업로드하기",
    image: "/images/banner/banner-1.jpg",
  },
  {
    title: "인기 커버를 만나보세요",
    description: "지금 가장 많이 사랑받는 커버 콘텐츠를 확인해보세요.",
    buttonText: "둘러보기",
    image: "/images/banner/banner-2.jpg",
  },
  {
    title: "새로운 아티스트를 발견하세요",
    description: "다양한 장르의 커버 아티스트를 만나보세요.",
    buttonText: "시작하기",
    image: "/images/banner/banner-3.jpg",
  },
];

export default function MainBanner() {
  const [isPlaying, setIsPlaying] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleToggleAutoplay = () => {
    if (!swiperRef.current) return;

    if (isPlaying) {
      swiperRef.current.autoplay.stop();
      setIsPlaying(false);
    } else {
      swiperRef.current.autoplay.start();
      setIsPlaying(true);
    }
  };

  const bannerClickHandler = (type: string) => {
    const formLink = "https://forms.gle/tkzk8Qk9n6JYMoav6";
    switch (type) {
      case "desktop":
        if (!isMobile) {
          // 데스크톱에서는 의견 남기기 페이지로 이동
          window.open(formLink, "_blank");
        }
        break;
      case "mobile":
        if (isMobile) {
          // 모바일에서는 의견 남기기 페이지로 이동
          window.open(formLink, "_blank");
        }
        break;
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        // borderRadius: { xs: 0, md: 4 },
        overflow: "hidden",
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".main-banner-pagination",
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.title}>
            {/* <Box
              sx={{
                position: "relative",
                height: { xs: 260, sm: 340, md: 420 },
                display: "flex",
                alignItems: "center",
                px: { xs: 3, sm: 5, md: 8 },
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(0,0,0,0.72) 0%,
                    rgba(0,0,0,0.45) 45%,
                    rgba(0,0,0,0.12) 100%
                  ),
                  url(${banner.image})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box sx={{ maxWidth: 520, color: "#fff" }}>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: 28, sm: 38, md: 48 },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  {banner.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 15, sm: 17, md: 18 },
                    color: "rgba(255,255,255,0.82)",
                    mb: 4,
                  }}
                >
                  {banner.description}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 999,
                    px: 4,
                    py: 1.3,
                    fontWeight: 700,
                  }}
                >
                  {banner.buttonText}
                </Button>
              </Box>
            </Box> */}
            <Box
              sx={{
                backgroundColor: "#FEE9E7",
                height: "170px",
                width: "100%",
                padding: "0 10px",
                cursor: isMobile ? "initial" : "pointer",
              }}
              onClick={() => bannerClickHandler("desktop")}
            >
              <Box className="relative flex h-full sm:w-full max-w-[650px] mx-auto ">
                <Box className="flex flex-col justify-center" zIndex={1}>
                  <Box className="banner mb-1">서비스는 어떠셨나요?</Box>
                  <Box className="bannerSub mb-1">
                    {isMobile ? (
                      <>
                        더 좋은 서비스를 위해 <br /> 여러분의 의견을 들려주세요.
                      </>
                    ) : (
                      "더 좋은 서비스를 위해 여러분의 의견을 들려주세요."
                    )}
                  </Box>
                  <Box display={isMobile ? "block" : "none"}>
                    <PostBasicButton
                      onClick={() => bannerClickHandler("mobile")}
                      backgroundColor={theme.palette.gray.fourth}
                      hoverBGColor={theme.palette.gray.primary}
                      color="white"
                    >
                      의견 남기기
                    </PostBasicButton>
                  </Box>
                </Box>
                <Box
                  className="absolute"
                  sx={{
                    bottom: 25,
                    right: 0,
                    zIndex: 0,
                    scale: isMobile ? 0.8 : 1,
                  }}
                >
                  <img src={"/asset/image/banner.png"} alt="banner" />
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "8px",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IconButton size="small" onClick={handlePrev}>
            <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
          </IconButton>

          <Box
            className="main-banner-pagination"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          />

          <IconButton size="small" onClick={handleToggleAutoplay}>
            {isPlaying ? (
              <PauseIcon sx={{ fontSize: 18 }} />
            ) : (
              <PlayArrowIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>

          <IconButton size="small" onClick={handleNext}>
            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Swiper>
    </Box>
  );
}
