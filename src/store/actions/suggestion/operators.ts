import { Suggestion } from 'logic/state';
import { SuggestionType } from 'logic/state/Suggestion';
import { ChatItem, ChatItemType, CreateChatItem } from 'logic/state/ChatItem';
import { RemoteAnswer } from 'logic/state/RemoteQuestion';
import { createMapOperators } from 'utils/createMapOperators';

export const suggestionOperations = createMapOperators<{
  mapSuggestionQuestionToChatItem: [
    Suggestion<SuggestionType.RemoteQuestion>,
    ChatItem<ChatItemType.RemoteQuestion>
  ];
  mapSuggestionQuestionToAnswer: [
    Suggestion<SuggestionType.RemoteQuestion>,
    RemoteAnswer
  ];
}>({
  mapSuggestionQuestionToChatItem: ({ value, uuid }) => {
    return CreateChatItem[ChatItemType.RemoteQuestion]({
      question: value.question,
      id: uuid()
    });
  },
  mapSuggestionQuestionToAnswer: ({ value }) => {
    return value.question.answer;
  }
});
