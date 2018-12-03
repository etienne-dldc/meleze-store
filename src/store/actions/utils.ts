import algoliasearchHelper from 'algoliasearch-helper';
import { RemoteQuestion, SuggestionAny } from '../state';
import { run, map } from './operators';
import { RemoteQuestionsMapper, RemoteAnswer, RemoteAnswerMessage } from '../state/RemoteQuestion';
import { Answer, AnswerType, CreateAnswer, AnswerAny } from '../state/Answer';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export const getEventValue = map<ChangeEvent, string>(({ value: event }) => event.currentTarget.value);

export const doSearch = map<any, Promise<algoliasearchHelper.SearchResults<any>>>(ctx =>
  ctx.algolia.search(ctx.state.query)
);

export const extractHits = map<algoliasearchHelper.SearchResults<any>, Array<RemoteQuestion>>(({ value }) => {
  try {
    return RemoteQuestionsMapper(value.hits);
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const selectNextSuggestion = map<any, number | null>(effects => {
  if (effects.state.suggestions.length === 0 || effects.state.selectedSuggestionIndex === null) {
    return null;
  }
  return (effects.state.selectedSuggestionIndex + 1) % effects.state.suggestions.length;
});

export const selectPrevSuggestion = map<any, number | null>(effects => {
  if (effects.state.suggestions.length === 0 || effects.state.selectedSuggestionIndex === null) {
    return null;
  }
  return (
    (effects.state.suggestions.length + effects.state.selectedSuggestionIndex - 1) % effects.state.suggestions.length
  );
});

export const mapSuggestionNotNull = map<SuggestionAny | null, SuggestionAny>(({ value }) => {
  if (value === null) {
    throw new Error('Invariant null suggestion');
  }
  return value;
});

export const getSelectedSuggestion = map<any, SuggestionAny | null>(({ state }) => state.selectedSuggestion);

export const mapRemoteAnswerToRemoteAnswerMessages = map<RemoteAnswer, Array<RemoteAnswerMessage>>(
  ({ value }) => value.messages || []
);

export const mapRemoteAnswerMessagesToAnswers = map<Array<RemoteAnswerMessage>, Array<Answer<AnswerType.Message>>>(
  ({ value }) =>
    value.map(val =>
      CreateAnswer[AnswerType.Message]({
        content: val.content,
        duration: val.duration,
        timer: null,
      })
    )
);

export const getRunningAnswer = map<any, AnswerAny | null>(({ state }) => state.runningAnswer);

// export const mapMessageAnswerToTimer = map<Answer<AnswerType.Message>, number>(({ value }) => {})

// export const filterSuggestionIsNotNull = filterValue<
//   SuggestionAny | null,
//   SuggestionAny
// >(function filterSuggestionIsNotNull(value): value is SuggestionAny {
//   return value !== null;
// });

// export const listenWindowResize = run<Overmind<IConfig>>(function listenWindowResize({
//   syncWindowSize,
//   value: app
// }) {
//   syncWindowSize(size => app.actions.setWindowSize(size));
// });

export const initAlgolia = run(function initAlgolia(effects) {
  return effects.algolia.init();
});
