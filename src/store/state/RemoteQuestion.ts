import { Mapper } from 'utils/Mapper';

export type RemoteAnswerMessage = {
  content: string;
  duration?: number;
};

export const RemoteAnswerMessageSchema = Mapper.schema<RemoteAnswerMessage>({
  content: Mapper.str,
  duration: Mapper.optional(Mapper.num)
});

export type RemoteAnswer = {
  messages?: Array<RemoteAnswerMessage>;
};

export type RemoteAnswerWithMessages = {
  messages: Array<RemoteAnswerMessage>;
};

export const RemoteAnswerSchema = Mapper.schema<RemoteAnswer>({
  messages: Mapper.optional(Mapper.array(RemoteAnswerMessageSchema))
});

export type RemoteQuestion = {
  question: string;
  objectID: string;
  answer: RemoteAnswer;
};

export const RemoteQuestionSchema = Mapper.schema<RemoteQuestion>({
  question: Mapper.str,
  objectID: Mapper.str,
  answer: RemoteAnswerSchema
});

export const RemoteQuestionsMapper = Mapper.create(
  Mapper.array(RemoteQuestionSchema)
);
