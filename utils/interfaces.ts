export interface AddTrackToPlaylistRequest {
  ytId: string;
  ytLink: string;
  playlistId?: string;
  thumbnail: string;
  title: string;
}

export interface TrackWithoutId {
  ytId: string;
  ytLink: string;
  playlistId: string;
  thumbnail: string;
  audio: string;
  title: string;
  customTitle: string;
  order: number;
}

export type Track = TrackWithoutId & {id: number}

export interface TrackEncoded {
  id: number;
  audio: string;
  customTitle: string;
  order: number;
}
