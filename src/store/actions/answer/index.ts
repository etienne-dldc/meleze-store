import { Operator, fork, pipe, filter } from 'overmind';
import { AnswerAny, AnswerType, Answer } from 'logic/state/Answer';
import { noop } from 'utils/noop';
import { operators } from '../operators';
import { filterValue } from 'utils/filterValue';

const handleMessageAnswer: Operator<
  Answer<AnswerType.Message>,
  Answer<AnswerType.Message>
> = pipe(
  filter(function timerIsNull({ value }) {
    return value.timer !== null;
  }),

  noop('Message')
);

type Paths = { [K in AnswerType]: Operator<Answer<K>, any> } & {
  ignore: Operator<any, any>;
};

export const handleAnswer: Operator<AnswerAny, AnswerAny> = fork<
  AnswerAny,
  Paths
>(
  function chooseAnswerPath({ value }) {
    return value.type;
  },
  {
    [AnswerType.Message]: handleMessageAnswer,
    ignore: noop()
  }
);

export const handleRunningAnswer: Operator<void, AnswerAny> = pipe(
  operators.getRunningAnswer,
  filterValue(function runninAnswerIsNotNull(value): value is AnswerAny {
    return value !== null;
  }),
  handleAnswer
);
