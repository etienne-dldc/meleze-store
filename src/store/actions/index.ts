import { operators } from './operators';
import { mutations } from './mutations';
import { SuggestionAny, RemoteQuestion } from '../state';
import { handleSuggestion } from './suggestion';
import { pipe, parallel, map, Operator, IConfig, Overmind } from 'overmind';

export { handleRunningAnswer } from './answer';

export const { setSelectedSuggestionIndex, setWindowSize } = mutations;

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export const setQuery: Operator<ChangeEvent, string> = pipe(
  operators.getEventValue,
  mutations.setQuery
);

export const setSearchHits: Operator<
  Array<RemoteQuestion>,
  Array<RemoteQuestion>
> = pipe(
  mutations.setSearchHits,
  mutations.resetSelectedSuggestionIndex
);

export const updateHits: Operator<any, Array<RemoteQuestion>> = pipe(
  operators.doSearch,
  operators.extractHits,
  setSearchHits
);

export const initSearch: Operator<any, Array<RemoteQuestion>> = pipe(
  operators.initAlgolia,
  updateHits
);

export const onInitialize: Operator<Overmind<IConfig>, any> = parallel([
  initSearch,
  operators.listenWindowResize
]);

export const selectNextSuggestion: Operator<void, number | null> = pipe(
  operators.selectNextSuggestion,
  mutations.setSelectedSuggestionIndex
);

export const selectPrevSuggestion: Operator<void, number | null> = pipe(
  operators.selectPrevSuggestion,
  mutations.setSelectedSuggestionIndex
);

export const confirmSelectedSuggestion: Operator<
  void,
  SuggestionAny | null
> = pipe(
  operators.getSelectedSuggestion,
  handleSuggestion
);

const mapSuggestionIndexToSuggestion: Operator<
  number,
  SuggestionAny | null
> = map<number, SuggestionAny | null>(({ state, value }) => {
  const suggestion = state.suggestions[value];
  if (suggestion === undefined) {
    return null;
  }
  return suggestion;
});

export const confirmSuggestionAtIndex: Operator<
  number,
  SuggestionAny | null
> = pipe(
  mapSuggestionIndexToSuggestion,
  handleSuggestion
);
