import { Reaction } from 'overmind';
import * as actions from './actions';

export const onRunningAnswerChange: Reaction = reaction =>
  reaction(state => state.answerQueue, actions.handleRunningAnswer);

export const updateHitsOnQueryChange: Reaction = reaction =>
  reaction(state => state.query, actions.updateHits);
