import { headers } from "next/headers";
import PostClient from "./components/PostClient";
import { Metadata } from "next";

export const revalidate = 120;

interface Props {
  params: Promise<{ id: string }>;
}

// 데이터 한 번만 가져오기
async function getPost(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/list/${id}`,
    { next: { revalidate: 120 } },
  );
  if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getPost(id);
  const post = result.data;

  if (!post) return { title: "포스트를 찾을 수 없습니다." };

  const tagString = post.tags?.map((t: string) => `#${t}`).join(" ");

  return {
    title: `${post.coverTitle} (${post.coverArtist} 커버) | cover-cloud`,
    description: `${post.originalArtist} - ${post.originalTitle} 커버 영상. ${tagString}`,
    openGraph: {
      title: post.coverTitle,
      description: `${post.coverArtist}의 커버곡 - ${post.originalTitle}`,
    },
    keywords: [
      post.coverArtist,
      post.originalArtist,
      post.coverGenre,
      ...(post.tags || []),
    ],
  };
}

const PostViewPage = async ({ params }: Props) => {
  const { id } = await params;
  const post = await getPost(id);

  return <PostClient id={id} initialData={post} />;
};

export default PostViewPage;
