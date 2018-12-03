type CreateAnswerParams<T extends { [K in AnswerType]: {} | never }> = T;

export type AnswerId = string;

export enum AnswerType {
  Message = 'Message'
}

export type AnswerParams = CreateAnswerParams<{
  [AnswerType.Message]: {
    content: string;
    duration?: number;
    // not null if running
    timer: number | null;
  };
}>;

export type AnswerAny = {
  type: AnswerType;
};

export type Answer<T extends AnswerType> = {
  type: T;
} & ([AnswerParams[T]] extends [never] ? {} : AnswerParams[T]);

export const CreateAnswer: {
  [K in keyof AnswerParams]: [AnswerParams[K]] extends [never]
    ? (() => Answer<K>)
    : ((params: AnswerParams[K]) => Answer<K>)
} = Object.keys(AnswerType).reduce(
  (acc, key) => {
    acc[key] = (params: any) => ({ ...params, type: key });
    return acc;
  },
  {} as any
) as any;

export const AnswerIs: {
  [K in keyof AnswerParams]: (suggestion: AnswerAny) => suggestion is Answer<K>
} = Object.keys(AnswerType).reduce(
  (acc, key) => {
    acc[key] = (suggestion: AnswerAny) => (suggestion as any).type === key;
    return acc;
  },
  {} as any
) as any;
