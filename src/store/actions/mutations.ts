import { RemoteQuestion, WindowSize } from '../state';
import { ChatItemAny } from '../state/ChatItem';
import { AnswerAny } from '../state/Answer';
import { mutation } from './operators';

export const setQuery = mutation<string>(({ state, value }) => {
  if (state.query === value) {
    return;
  }
  state.query = value;
});

export const clearQuery = mutation<void>(({ state }) => {
  if (state.query === '') {
    return;
  }
  state.query = '';
});

export const setSearchHits = mutation<Array<RemoteQuestion>>(({ state, value: hits }) => {
  state.searchHits = hits;
});

export const resetSelectedSuggestionIndex = mutation<Array<RemoteQuestion>>(({ state, value: hits }) => {
  state.selectedSuggestionIndex = hits.length > 0 ? 0 : null;
});

export const setSelectedSuggestionIndex = mutation<number | null>(({ state, value }) => {
  state.selectedSuggestionIndex = value;
});

export const addChatItem = mutation<ChatItemAny>(({ state, value }) => {
  state.chat.unshift(value);
});

export const setWindowSize = mutation<WindowSize>(({ state, value }) => {
  state.windowSize = value;
});

export const pushAnswers = mutation<Array<AnswerAny>>(({ state, value }) => {
  state.answerQueue.push(...value);
});

export const pushAnswer = mutation<AnswerAny>(({ state, value }) => {
  state.answerQueue.push(value);
});

export const clearAnswerQueue = mutation<void>(({ state }) => {
  if (state.answerQueue.length > 0) {
    state.answerQueue = [];
  }
});
