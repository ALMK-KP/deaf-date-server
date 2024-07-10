export interface IAddTrackToPlaylistRequest {
  ytId: string;
  ytLink: string;
  playlistId?: string;
  thumbnail: string;
  title: string;
}

export interface ITrack {
  id?: string;
  ytId: string;
  ytLink: string;
  playlistId: string;
  thumbnail: string;
  audio: string;
  title: string;
  customTitle: string;
}
