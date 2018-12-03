import { RemoteQuestion } from './RemoteQuestion';

type CreateSuggestionParams<
  T extends { [K in SuggestionType]: {} | never }
> = T;

export type SuggestionId = string;

export enum SuggestionType {
  RemoteQuestion = 'RemoteQuestion',
  SearchByAlgolia = 'SearchByAlgolia',
  NoResult = 'NoResult'
}

export type SuggestionParams = CreateSuggestionParams<{
  [SuggestionType.RemoteQuestion]: {
    question: RemoteQuestion;
  };
  [SuggestionType.SearchByAlgolia]: never;
  [SuggestionType.NoResult]: never;
}>;

export type SuggestionAny = {
  type: SuggestionType;
};

export type Suggestion<T extends SuggestionType> = {
  type: T;
} & ([SuggestionParams[T]] extends [never] ? {} : SuggestionParams[T]);

export const CreateSuggestion: {
  [K in keyof SuggestionParams]: [SuggestionParams[K]] extends [never]
    ? (() => Suggestion<K>)
    : ((params: SuggestionParams[K]) => Suggestion<K>)
} = Object.keys(SuggestionType).reduce(
  (acc, key) => {
    acc[key] = (params: any) => ({ ...params, type: key });
    return acc;
  },
  {} as any
) as any;

export const SuggestionIs: {
  [K in keyof SuggestionParams]: (
    suggestion: SuggestionAny
  ) => suggestion is Suggestion<K>
} = Object.keys(SuggestionType).reduce(
  (acc, key) => {
    acc[key] = (suggestion: SuggestionAny) => (suggestion as any).type === key;
    return acc;
  },
  {} as any
) as any;

export const SuggestionIsSelectable = (suggestion: SuggestionAny): boolean => {
  return true;
};

export const getSuggestionKey = (suggestion: SuggestionAny): string => {
  if (SuggestionIs[SuggestionType.RemoteQuestion](suggestion)) {
    return suggestion.question.objectID;
  }
  if (SuggestionIs[SuggestionType.SearchByAlgolia](suggestion)) {
    return 'search-by-algolia';
  }
  if (SuggestionIs[SuggestionType.NoResult](suggestion)) {
    return 'no-result';
  }
  throw new Error(`Unknown Suggestion Type: ${suggestion.type}`);
};
