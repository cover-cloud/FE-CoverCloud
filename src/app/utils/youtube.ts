// 미디어 타입 정의
export type MediaPlatform = "youtube" | "tiktok" | "soundcloud" | null;

// 반환 타입 정의
export interface MediaUrlResult {
  platform: MediaPlatform;
  id: string | null;
  isValid: boolean;
  originalUrl: string;
  embedUrl?: string;
}

/**
 * YouTube, TikTok, SoundCloud URL을 감지하고 처리하는 통합 함수
 * @param url - 검증할 URL
 * @returns MediaUrlResult 객체
 */
export const detectAndValidateMediaUrl = (url: string): MediaUrlResult => {
  if (!url || typeof url !== "string") {
    return {
      platform: null,
      id: null,
      isValid: false,
      originalUrl: url || "",
    };
  }

  // YouTube 패턴
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/,
  ];

  // TikTok 패턴
  const tiktokPatterns = [
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/.*[?&]v=(\d+)/,
    /(?:https?:\/\/)?(?:vm|vt)\.tiktok\.com\/([A-Za-z0-9]+)/,
  ];

  // SoundCloud 패턴
  const soundcloudPatterns = [
    /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([\w-]+)\/([\w-]+)/,
    /(?:https?:\/\/)?(?:www\.)?soundcloud\.app\.goo\.gl\/([A-Za-z0-9]+)/,
  ];

  // YouTube 검증
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        platform: "youtube",
        id: match[1],
        isValid: true,
        originalUrl: url,
        embedUrl: `https://www.youtube.com/embed/${match[1]}`,
      };
    }
  }

  // TikTok 검증
  for (const pattern of tiktokPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        platform: "tiktok",
        id: match[1],
        isValid: true,
        originalUrl: url,
        embedUrl: `https://www.tiktok.com/player/v1/${match[1]}`,
      };
    }
  }

  // SoundCloud 검증
  for (const pattern of soundcloudPatterns) {
    const match = url.match(pattern);
    if (match) {
      // SoundCloud는 전체 경로를 ID로 사용
      const pathMatch = url.match(/soundcloud\.com\/([\w-]+\/[\w-]+)/);
      const id = pathMatch ? pathMatch[1] : null;

      return {
        platform: "soundcloud",
        id: id,
        isValid: true,
        originalUrl: url,
        // SoundCloud embed는 oEmbed API를 통해 생성해야 함
        embedUrl: id
          ? `https://w.soundcloud.com/player/?url=https://soundcloud.com/${id}`
          : undefined,
      };
    }
  }

  // 일치하는 패턴이 없을 경우
  return {
    platform: null,
    id: null,
    isValid: false,
    originalUrl: url,
  };
};

/**
 * 기존 YouTube 전용 함수 (하위 호환성 유지)
 */
export const getYoutubeVideoId = (url: string): string | null => {
  const result = detectAndValidateMediaUrl(url);
  return result.platform === "youtube" ? result.id : null;
};

/**
 * TikTok 비디오 ID 추출
 */
export const getTiktokVideoId = (url: string): string | null => {
  const result = detectAndValidateMediaUrl(url);
  return result.platform === "tiktok" ? result.id : null;
};

/**
 * SoundCloud 트랙 ID 추출
 */
export const getSoundcloudTrackId = (url: string): string | null => {
  const result = detectAndValidateMediaUrl(url);
  return result.platform === "soundcloud" ? result.id : null;
};

// 사용 예시 및 테스트
export const exampleUsage = () => {
  const testUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/abc123",
    "https://www.tiktok.com/@user/video/1234567890",
    "https://vm.tiktok.com/ZMeABC123",
    "https://soundcloud.com/artist-name/track-name",
    "https://www.google.com", // 잘못된 URL
  ];

  testUrls.forEach((url) => {
    const result = detectAndValidateMediaUrl(url);
    console.log(`URL: ${url}`);
    console.log(`Platform: ${result.platform}`);
    console.log(`Valid: ${result.isValid}`);
    console.log(`ID: ${result.id}`);
    console.log(`Embed URL: ${result.embedUrl}`);
    console.log("---");
  });
};

const fetchTiktokThumbnail = async (url: string) => {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
    );
    const data = await res.json();
    return data.thumbnail_url; // 썸네일 URL
  } catch (e) {
    console.error("TikTok 썸네일 가져오기 실패", e);
    return null;
  }
};

const fetchSoundCloudThumbnail = async (url: string) => {
  try {
    const res = await fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    );
    const data = await res.json();
    return data.thumbnail_url; // 썸네일 URL
  } catch (e) {
    console.error("SoundCloud 썸네일 가져오기 실패", e);
    return null;
  }
};

const getYoutubeThumbnail = (videoId: string) => {
  // 기본 퀄리티
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getMediaThumbnail = async (media: MediaUrlResult) => {
  if (!media.isValid || !media.platform) return null;

  switch (media.platform) {
    case "youtube":
      return media.id
        ? `https://img.youtube.com/vi/${media.id}/hqdefault.jpg`
        : null;
    case "tiktok":
      return await fetchTiktokThumbnail(media.originalUrl);
    case "soundcloud":
      return await fetchSoundCloudThumbnail(media.originalUrl);
    default:
      return null;
  }
};
