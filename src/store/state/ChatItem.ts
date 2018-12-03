import { RemoteQuestion } from './RemoteQuestion';

type CreateChatItemParams<T extends { [K in ChatItemType]: {} | never }> = T;

export enum ChatItemType {
  RemoteQuestion = 'RemoteQuestion',
  LocalAnswer = 'LocalAnswer'
}

export type ChatItemId = string;

export type ChatItemParams = CreateChatItemParams<{
  [ChatItemType.RemoteQuestion]: { question: RemoteQuestion };
  [ChatItemType.LocalAnswer]: { content: string };
}>;

export type ChatItemAny = {
  type: ChatItemType;
  id: ChatItemId;
};

export type ChatItem<T extends ChatItemType> = {
  type: T;
  id: ChatItemId;
} & ([ChatItemParams[T]] extends [never] ? {} : ChatItemParams[T]);

export const CreateChatItem: {
  [K in keyof ChatItemParams]: [ChatItemParams[K]] extends [never]
    ? ((params: { id: ChatItemId }) => ChatItem<K>)
    : ((params: ChatItemParams[K] & { id: ChatItemId }) => ChatItem<K>)
} = Object.keys(ChatItemType).reduce(
  (acc, key) => {
    acc[key] = (params: any) => ({ ...params, type: key });
    return acc;
  },
  {} as any
) as any;

export const ChatItemIs: {
  [K in keyof ChatItemParams]: (
    suggestion: ChatItemAny
  ) => suggestion is ChatItem<K>
} = Object.keys(ChatItemType).reduce(
  (acc, key) => {
    acc[key] = (chatItem: ChatItemAny) => (chatItem as any).type === key;
    return acc;
  },
  {} as any
) as any;
