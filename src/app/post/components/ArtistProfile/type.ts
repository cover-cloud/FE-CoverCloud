export type ArtistProfileProps = {
  coverArtist: string;
  songTitle: string;
  coverUrl: string;
  isSearch?: boolean;
};
export type ArtistProfileMobileProps = ArtistProfileProps & {
  isMobile: boolean;
};
