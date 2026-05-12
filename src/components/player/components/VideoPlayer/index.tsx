"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { MediaPlatform } from "@/app/utils/youtube";
import { useYouTubePlayer } from "@/app/hook/useYouTubePlayer";
import { useSoundCloudPlayer } from "@/app/hook/useSoundCloudPlayer";

type VideoPlayerProps = {
  videoId: string;
  videoType: MediaPlatform;
  videoData: any;
  onVideoEnded?: () => void;
  getAspectRatio: (videoData: any) => string;
  autoPlay?: boolean;
};

const VideoPlayer = ({
  videoId,
  videoType,
  videoData,
  onVideoEnded,
  getAspectRatio,
  autoPlay = false,
}: VideoPlayerProps) => {
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const scIframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleEnded = useCallback(() => {
    if (!autoPlay) return;

    onVideoEnded?.();
  }, [autoPlay, onVideoEnded]);

  useYouTubePlayer({
    iframeRef: ytIframeRef,
    videoId: videoType === "youtube" ? videoId : "",
    onEnded: handleEnded,
  });

  useSoundCloudPlayer({
    iframeRef: scIframeRef,
    onEnded: handleEnded,
  });

  const buildYouTubeSrc = useCallback(() => {
    const url = new URL(videoId);

    url.searchParams.set("enablejsapi", "1");

    if (typeof window !== "undefined") {
      url.searchParams.set("origin", window.location.origin);
    }

    if (autoPlay) {
      url.searchParams.set("autoplay", "1");
    } else {
      url.searchParams.delete("autoplay");
    }

    return url.toString();
  }, [videoId, autoPlay]);

  const buildSoundCloudSrc = useCallback(() => {
    const url = new URL(videoId);

    url.searchParams.set("enable_api", "true");

    if (autoPlay) {
      url.searchParams.set("auto_play", "true");
    } else {
      url.searchParams.delete("auto_play");
    }

    return url.toString();
  }, [videoId, autoPlay]);

  const [ytSrc, setYtSrc] = useState(videoId);
  const [scSrc, setScSrc] = useState(videoId);

  useEffect(() => {
    if (!videoId) return;

    if (videoType === "youtube") {
      setYtSrc(buildYouTubeSrc());
    }

    if (videoType === "soundcloud") {
      setScSrc(buildSoundCloudSrc());
    }
  }, [videoId, videoType, buildYouTubeSrc, buildSoundCloudSrc]);

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
        allow="autoplay; encrypted-media; picture-in-picture"
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
        allow="autoplay"
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
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
};

export default VideoPlayer;
