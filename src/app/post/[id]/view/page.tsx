import { headers } from "next/headers";
import PostClient from "./components/PostClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // 서버 데이터 호출
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/list/${id}`,
  );
  const result = await res.json();

  // 데이터 추출 (제공해주신 구조: result.data 가 본체)
  const post = result.data;

  if (!post) return { title: "포스트를 찾을 수 없습니다." };

  // 태그들을 문자열로 합침 (#태그1 #태그2)
  const tagString = post.tags?.map((t: string) => `#${t}`).join(" ");

  return {
    title: `${post.coverTitle} (${post.coverArtist} 커버) | cover-cloud`,
    description: `${post.originalArtist} - ${post.originalTitle} 커버 영상. ${tagString}`,
    openGraph: {
      title: post.coverTitle,
      description: `${post.coverArtist}의 커버곡 - ${post.originalTitle}`,
      // 유튜브 썸네일 자동 추출 (필요 시)
      // images: [post.link.includes('v=')
      //   ? `https://img.youtube.com/vi/${post.link.split('v=')[1].split('&')[0]}/maxresdefault.jpg`
      //   : '기본이미지URL'],
    },
    // 검색 엔진에 노출될 키워드
    keywords: [
      post.coverArtist,
      post.originalArtist,
      post.coverGenre,
      ...(post.tags || []),
    ],
  };
}
const PostViewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/list/${id}`,
  );
  if (!res.ok) {
    throw new Error("데이터를 불러오는 데 실패했습니다.");
  }
  const post = await res.json();

  return <PostClient id={id} initialData={post} />;
};

export default PostViewPage;
