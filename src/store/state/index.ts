import {
  SuggestionAny,
  Suggestion,
  SuggestionType,
  CreateSuggestion
} from './Suggestion';
import { RemoteQuestion } from './RemoteQuestion';
import { Derive } from 'overmind';
import { ChatItemAny, CreateChatItem, ChatItemType } from './ChatItem';
import { uuid } from 'logic/effects';
import { AnswerAny } from './Answer';

export { RemoteQuestion, Suggestion, SuggestionAny };

/**
 * Types
 */

type SuggestionItems = Array<SuggestionAny>;

export type WindowSize = {
  height: number;
  width: number;
};

export type Layout = {
  split: number;
  chatHeight: Derive<Layout, number>;
  searchHeight: Derive<Layout, number>;
};

export type State = {
  query: string;
  searchHits: Array<RemoteQuestion>;
  selectedSuggestionIndex: number | null;
  hitsCount: Derive<State, number>;
  chat: Array<ChatItemAny>;
  answerQueue: Array<AnswerAny>;
  runningAnswer: Derive<State, AnswerAny | null>;
  suggestions: Derive<State, SuggestionItems>;
  selectedSuggestion: Derive<State, SuggestionAny | null>;
  windowSize: WindowSize;
  layout: Layout;
  chatHeight: number;
};

/**
 * Derived
 */

const selectedSuggestion: Derive<State, SuggestionAny | null> = s => {
  if (s.selectedSuggestionIndex === null) {
    return null;
  }
  const suggestion = s.suggestions[s.selectedSuggestionIndex];
  if (suggestion === undefined) {
    return null;
  }
  return suggestion;
};

const hitsCount: Derive<State, number> = s => s.searchHits.length;

const suggestions: Derive<State, SuggestionItems> = (parent, state) => {
  if (parent.searchHits.length === 0) {
    return [CreateSuggestion[SuggestionType.NoResult]()];
  }
  return [
    ...parent.searchHits.map(question =>
      CreateSuggestion[SuggestionType.RemoteQuestion]({
        question
      })
    ),
    CreateSuggestion[SuggestionType.SearchByAlgolia]()
  ];
};

const chatHeight: Derive<Layout, number> = (parent, state) => {
  return Math.round(parent.split * state.windowSize.height);
};

const searchHeight: Derive<Layout, number> = (parent, state) => {
  return Math.round((1 - parent.split) * state.windowSize.height);
};

const runningAnswer: Derive<State, AnswerAny | null> = (parent, state) => {
  return parent.answerQueue[0] || null;
};

/**
 * State
 */

const state: State = {
  query: '',
  searchHits: [],
  chat: [
    CreateChatItem[ChatItemType.LocalAnswer]({
      content: 'Hello this is a test',
      id: uuid()
    }),
    CreateChatItem[ChatItemType.LocalAnswer]({
      content: 'Hello this is a test',
      id: uuid()
    }),
    CreateChatItem[ChatItemType.LocalAnswer]({
      content: 'Hello this is a test',
      id: uuid()
    }),
    CreateChatItem[ChatItemType.LocalAnswer]({
      content: 'Hello this is a test',
      id: uuid()
    }),
    CreateChatItem[ChatItemType.LocalAnswer]({
      content: 'Hello this is a test',
      id: uuid()
    })
  ],
  answerQueue: [],
  runningAnswer,
  selectedSuggestionIndex: null,
  hitsCount,
  suggestions,
  selectedSuggestion,
  windowSize: {
    height: window.innerHeight,
    width: window.innerWidth
  },
  layout: {
    split: 0.4,
    chatHeight,
    searchHeight
  },
  chatHeight: Math.floor(window.innerHeight / 2)
};

export default state;
