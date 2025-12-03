export type CommentData = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  userAvatarImageUrl: string;
  userName: string;
  comment: string;
  likes: number;
  replies: CommentData[];
};

export const sampleComment: CommentData[] = [
  {
    id: "comment_1",
    userId: "user_123",
    createdAt: "2025-12-03T12:00:00Z",
    updatedAt: "2025-12-03T12:05:00Z",
    userAvatarImageUrl: "",
    userName: "John Doe",
    comment: "이거 정말 흥미로운 내용이네요!",
    likes: 10,
    replies: [
      {
        id: "comment_1_1",
        userId: "user_456",
        createdAt: "2025-12-03T12:10:00Z",
        updatedAt: "2025-12-03T12:15:00Z",
        userAvatarImageUrl: "",
        userName: "Jane Smith",
        comment: "저도 동의해요! 추가로 이런 부분도 중요하다고 생각합니다.",
        likes: 10,
        replies: [],
      },
      {
        id: "comment_1_2",
        userId: "user_789",
        createdAt: "2025-12-03T12:20:00Z",
        updatedAt: "2025-12-03T12:25:00Z",
        userAvatarImageUrl: "",
        userName: "Alex Kim",
        comment: "참고로 이런 자료도 확인해보세요!",
        likes: 10,
        replies: [],
      },
    ],
  },
  {
    id: "comment_2",
    userId: "user_123",
    createdAt: "2025-12-03T12:00:00Z",
    updatedAt: "2025-12-03T12:05:00Z",
    userAvatarImageUrl: "",
    userName: "John Doe",
    comment: "이거 정말 흥미로운 내용이네요!",
    likes: 10,
    replies: [
      {
        id: "comment_2_1",
        userId: "user_456",
        createdAt: "2025-12-03T12:10:00Z",
        updatedAt: "2025-12-03T12:15:00Z",
        userAvatarImageUrl: "",
        userName: "Jane Smith",
        comment: "저도 동의해요! 추가로 이런 부분도 중요하다고 생각합니다.",
        likes: 10,
        replies: [],
      },
      {
        id: "comment_2_2",
        userId: "user_789",
        createdAt: "2025-12-03T12:20:00Z",
        updatedAt: "2025-12-03T12:25:00Z",
        userAvatarImageUrl: "",
        userName: "Alex Kim",
        comment: "참고로 이런 자료도 확인해보세요!",
        likes: 10,
        replies: [],
      },
    ],
  },
];
export const sampleCommentCount = sampleComment.length;
