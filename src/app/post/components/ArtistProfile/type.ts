export type ArtistProfileProps = {
  coverArtist: string;
  songName: string;
  albumImage: string;
};
export type ArtistProfileMobileProps = ArtistProfileProps & {
  isMobile: boolean;
};
