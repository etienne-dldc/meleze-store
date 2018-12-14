import { Suggestion } from '../../state';
import { SuggestionType } from '../../state/Suggestion';
import { ChatItem, ChatItemType, CreateChatItem } from '../../state/ChatItem';
import { RemoteAnswer } from '../../state/RemoteQuestion';
import { map } from '../operators';

export const mapSuggestionQuestionToChatItem = map<
  Suggestion<SuggestionType.RemoteQuestion>,
  ChatItem<ChatItemType.RemoteQuestion>
>(({ value, uuid }) => {
  return CreateChatItem[ChatItemType.RemoteQuestion]({
    question: value.question,
    id: uuid(),
  });
});

export const mapSuggestionQuestionToAnswer = map<Suggestion<SuggestionType.RemoteQuestion>, RemoteAnswer>(
  ({ value }) => {
    return value.question.answer;
  }
);
