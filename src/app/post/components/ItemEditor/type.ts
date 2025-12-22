import { z } from "zod";
export const formSchema = z
  .object({
    link: z.string().min(1, "링크를 입력해주세요"),
    songName: z.string(),
    songNameManual: z.object({
      songName: z.string(),
      artist: z.string(),
    }),
    coverArtist: z.string().min(1, "커버 아티스트를 입력해주세요"),
    genre: z.string().min(1, "장르를 입력해주세요"),
    title: z.string().min(1, "제목을 입력해주세요"),
    tag: z.string(),
  })
  .superRefine((data, ctx) => {
    // songName이 비어있으면
    if (!data.songName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "검색 노래 이름을 입력해주세요.",
        path: ["songName"], // songName 필드에 에러 표시
      });
    }

    // songNameManual이 비어있으면
    if (!data.songNameManual.songName || !data.songNameManual.artist) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "수동 입력 노래 이름과 아티스트를 입력해주세요.",
        path: ["songNameManual", "songName"], // songNameManual.songName 필드에 에러 표시
      });
    }
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
