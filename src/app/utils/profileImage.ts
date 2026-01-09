export const getProfileImage = (profileImage: string) => {
  return profileImage?.replace("http://", "https://") || "";
};
