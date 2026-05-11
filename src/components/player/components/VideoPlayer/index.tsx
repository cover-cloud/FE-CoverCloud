"use client";
// components/VideoPlayer.tsx
import React, { useRef, useCallback, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { MediaPlatform } from "@/app/utils/youtube";
import { useYouTubePlayer } from "@/app/hook/useYouTubePlayer";
import { useSoundCloudPlayer } from "@/app/hook/useSoundCloudPlayer";

const VideoPlayer = ({
  videoId,
  videoType,
  videoData,
  onVideoEnded,
  getAspectRatio,
}: {
  videoId: string;
  videoType: MediaPlatform;
  videoData: any;
  onVideoEnded: () => void;
  getAspectRatio: (videoData: any) => string;
}) => {
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const scIframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleEnded = useCallback(() => {
    console.log(`${videoType} 영상 종료됨`);
    // 알고리즘에 따른 넥스트비디오아이디 or 다음 포스트로 이동
    onVideoEnded();
  }, [videoType, onVideoEnded]);

  useYouTubePlayer({
    iframeRef: ytIframeRef,
    videoId: videoType === "youtube" ? videoId : "",
    onEnded: handleEnded,
  });

  useSoundCloudPlayer({
    iframeRef: scIframeRef,
    onEnded: handleEnded,
  });

  const [ytSrc, setYtSrc] = useState(() =>
    videoId.includes("enablejsapi")
      ? videoId
      : `${videoId}${videoId.includes("?") ? "&" : "?"}enablejsapi=1`,
  );

  useEffect(() => {
    if (!videoId.includes("enablejsapi")) {
      setYtSrc(
        `${videoId}${videoId.includes("?") ? "&" : "?"}enablejsapi=1&origin=${window.location.origin}`,
      );
    }
  }, [videoId]);

  const scSrc = videoId.includes("enable_api")
    ? videoId
    : `${videoId}${videoId.includes("?") ? "&" : "?"}enable_api=true`;

  if (videoType === "youtube") {
    return (
      <iframe
        ref={ytIframeRef}
        src={ytSrc}
        width="100%"
        height="auto"
        style={{
          aspectRatio: getAspectRatio(videoData),
          borderRadius: "12px",
          border: "none",
        }}
        allowFullScreen
      />
    );
  }

  if (videoType === "soundcloud") {
    return (
      <iframe
        ref={scIframeRef}
        src={scSrc}
        width="100%"
        height="200px"
        style={{
          borderRadius: "12px",
          border: "none",
        }}
        allowFullScreen
      />
    );
  }

  return (
    <iframe
      src={videoId}
      width="100%"
      height="auto"
      style={{
        aspectRatio: getAspectRatio(videoData),
        borderRadius: "12px",
        border: "none",
      }}
      allowFullScreen
    />
  );
};

export default VideoPlayer;
