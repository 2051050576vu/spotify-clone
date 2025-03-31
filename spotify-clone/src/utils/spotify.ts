import SpotifyWebApi from 'spotify-web-api-js';

const clientId = '031c99f173204993a3b8f2bef3f01aa5';
const redirectUri = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'YOUR_DEPLOYED_URL';

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private'
];

export const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}&response_type=token`;

export const spotify = new SpotifyWebApi();