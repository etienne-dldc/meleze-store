import { pipe, fork, Operator } from 'overmind';
import { operators } from '../operators';
import { mutations } from '../mutations';
import { SuggestionAny } from '../../state';
import { SuggestionType, Suggestion } from '../../state/Suggestion';
import { suggestionOperations } from './operators';
import { scope } from 'utils/scope';
import { noop } from 'utils/noop';
import {
  RemoteAnswer,
  RemoteAnswerWithMessages
} from 'logic/state/RemoteQuestion';
import { filterValue } from 'utils/filterValue';

export const handleRemoteAnswer: Operator<RemoteAnswer, RemoteAnswer> = pipe(
  filterValue(function awserHasMessages(
    value
  ): value is RemoteAnswerWithMessages {
    return !!value.messages && value.messages.length > 0;
  }),
  operators.mapRemoteAnswerToRemoteAnswerMessages,
  operators.mapRemoteAnswerMessagesToAnswers,
  mutations.pushAnswers
);

export const handleQuestionSuggestion: Operator<
  Suggestion<SuggestionType.RemoteQuestion>,
  Suggestion<SuggestionType.RemoteQuestion>
> = pipe(
  mutations.clearAnswerQueue,
  scope(
    'addChatItem',
    suggestionOperations.mapSuggestionQuestionToChatItem,
    mutations.addChatItem
  ),
  mutations.clearQuery,
  scope(
    'handleAnswer',
    suggestionOperations.mapSuggestionQuestionToAnswer,
    handleRemoteAnswer
  )
);

type Paths = { [K in SuggestionType]: Operator<Suggestion<K>, any> } & {
  ignore: Operator<SuggestionAny | null, any>;
};

export const handleSuggestion: Operator<
  SuggestionAny | null,
  SuggestionAny | null
> = pipe(
  operators.filterSuggestionIsNotNull,
  fork<SuggestionAny | null, Paths>(
    function chooseSuggestionPath({ value }) {
      if (value === null) {
        return 'ignore';
      }
      return value.type;
    },
    {
      ignore: noop(),
      [SuggestionType.RemoteQuestion]: handleQuestionSuggestion,
      [SuggestionType.NoResult]: noop(),
      [SuggestionType.SearchByAlgolia]: noop()
    }
  )
);
