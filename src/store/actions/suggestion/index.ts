import * as mutations from '../mutations';
import { SuggestionAny } from '../../state';
import { SuggestionType, Suggestion, SuggestionIs } from '../../state/Suggestion';
import { RemoteAnswer } from '../../state/RemoteQuestion';
import * as suggestionOperations from './operators';
import { action, pipe, inject } from '../operators';

export const handleRemoteAnswer = action<RemoteAnswer, any>(() => {
  return null;
  //   filterValue(function awserHasMessages(value): value is RemoteAnswerWithMessages {
  //     return !!value.messages && value.messages.length > 0;
  //   }),
  //   utils.mapRemoteAnswerToRemoteAnswerMessages,
  //   utils.mapRemoteAnswerMessagesToAnswers,
  //   mutations.pushAnswers
});

export const handleQuestionSuggestion = action<Suggestion<SuggestionType.RemoteQuestion>, any>(({ value }) => {
  console.log(value);
  return pipe(
    mutations.clearAnswerQueue,
    inject(value),
    suggestionOperations.mapSuggestionQuestionToChatItem,
    mutations.addChatItem,
    mutations.clearQuery,
    inject(value),
    suggestionOperations.mapSuggestionQuestionToAnswer,
    handleRemoteAnswer
  );
});

export const handleSuggestion = action<SuggestionAny | null, any>(({ value }) => {
  if (value === null) {
    return null;
  }
  if (SuggestionIs[SuggestionType.RemoteQuestion](value)) {
    return handleQuestionSuggestion(value);
  }
  return null;
});

//   utils.filterSuggestionIsNotNull,
//   fork<SuggestionAny | null, Paths>(
//     function chooseSuggestionPath({ value }) {
//       if (value === null) {
//         return 'ignore';
//       }
//       return value.type;
//     },
//     {
//       ignore: noop(),
//       [SuggestionType.RemoteQuestion]: handleQuestionSuggestion,
//       [SuggestionType.NoResult]: noop(),
//       [SuggestionType.SearchByAlgolia]: noop()
//     }
//   )
// );
