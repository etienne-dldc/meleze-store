import * as utils from './utils';
import * as mutations from './mutations';
import { SuggestionAny } from '../state';
import { handleSuggestion } from './suggestion';
import { pipe, map, parallel } from './operators';

export { handleRunningAnswer } from './answer';

export const { setSelectedSuggestionIndex, setWindowSize } = mutations;

export const setQuery = pipe(
  utils.getEventValue,
  mutations.setQuery
);

export const setSearchHits = pipe(
  mutations.setSearchHits,
  mutations.resetSelectedSuggestionIndex
);

export const updateHits = pipe(
  utils.doSearch,
  utils.extractHits,
  setSearchHits
);

export const initSearch = pipe(
  utils.initAlgolia,
  updateHits
);

export const onInitialize = parallel(initSearch, utils.listenWindowResize);

export const selectNextSuggestion = pipe(
  utils.selectNextSuggestion,
  mutations.setSelectedSuggestionIndex
);

export const selectPrevSuggestion = pipe(
  utils.selectPrevSuggestion,
  mutations.setSelectedSuggestionIndex
);

export const confirmSelectedSuggestion = pipe(
  utils.getSelectedSuggestion,
  handleSuggestion
);

const mapSuggestionIndexToSuggestion = map<number, SuggestionAny | null>(({ state, value }) => {
  const suggestion = state.suggestions[value];
  if (suggestion === undefined) {
    return null;
  }
  return suggestion;
});

export const confirmSuggestionAtIndex = pipe(
  mapSuggestionIndexToSuggestion,
  handleSuggestion
);
