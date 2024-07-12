export interface IAddTrackToPlaylistRequest {
  ytId: string;
  ytLink: string;
  playlistId?: string;
  thumbnail: string;
  title: string;
}

export interface ITrackWithoutId {
  ytId: string;
  ytLink: string;
  playlistId: string;
  thumbnail: string;
  audio: string;
  title: string;
  customTitle: string;
}

export type ITrack = ITrackWithoutId & {id: number}

export interface ITrackEncoded {
  id: number;
  audio: string;
  customTitle: string;
}
