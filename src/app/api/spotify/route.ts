import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query param" }, { status: 400 });
  }

  try {
    const tokenData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(tokenData.body["access_token"]);

    const data = await spotifyApi.searchTracks(q, { limit: 5 });
    return NextResponse.json(data.body, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Spotify API request failed" },
      { status: 500 }
    );
  }
}
