import { z } from "zod";
export const formSchema = z.object({
  link: z.string().min(1, "링크를 입력해주세요"),
  songName: z.string().min(1, "노래 검색을 입력해주세요"),
  coverArtist: z.string().min(1, "커버 아티스트를 입력해주세요"),
  genre: z.string().min(1, "장르를 입력해주세요"),
  title: z.string().min(1, "제목을 입력해주세요"),
  tag: z.string(),
});

// 타입 추출
export type FormSchema = z.infer<typeof formSchema>;

export type FormField = {
  key: keyof FormSchema;
  label: string;
  placeholder: string;
  hasButton?: boolean;
};

export type SongData = {
  key: string;
  artist: string;
  songName: string;
  albumImage: string;
};
