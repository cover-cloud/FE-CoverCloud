export type ArtistProfileProps = {
  coverArtist: string;
  songTitle: string;
  coverUrl: string;
};
export type ArtistProfileMobileProps = ArtistProfileProps & {
  isMobile: boolean;
};
