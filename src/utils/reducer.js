import { reducerCases } from "./Constants"


export const initialState = {
    token: null,
    playlists : [],
    userInfo: null,
    selectedPlaylistId: "37i9dQZF1E4nRfrCEsvZkU",
    selectedPlaylist: null,
    currentlyPlaying: null,
    playerState: false,
};

const updateState = (state, key, value) => ({ ...state, [key]: value });

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_TOKEN:
      return updateState(state, 'token', action.token);
    case reducerCases.SET_PLAYLISTS:
      return updateState(state, 'playlists', action.playlists);
    case reducerCases.SET_USER:
      return updateState(state, 'userInfo', action.userInfo);
    case reducerCases.SET_PLAYLIST:
      return updateState(state, 'selectedPlaylist', action.selectedPlaylist);
    case reducerCases.SET_PLAYING:
      return updateState(state, 'currentlyPlaying', action.currentlyPlaying);
    case reducerCases.SET_PLAYER_STATE:
      return updateState(state, 'playerState', action.playerState);
    case reducerCases.SET_PLAYLISTS_ID:
      return updateState(state, 'selectedPlaylistId', action.selectedPlaylistId);
    default:
      console.error(`Unknown action type: ${action.type}`);
      return state;
  }
};

  export default reducer;
