import { mutate, map, pipe } from './index';

export const toggleTodo = mutate<string>(({ value: todoId, state }) => {
  const todo = state.todos.find(todo => todo.id === todoId);
  if (todo) {
    todo.done = !todo.done;
  }
});

const extractInputValue = map<React.ChangeEvent<HTMLInputElement>, string>(({ value: event }) => {
  return event.target.value;
});

export const addTodo = mutate(({ state }) => {
  state.todos.push({
    id: String(Math.floor(Math.random() * 1000000)),
    done: false,
    name: state.newTodoInput,
  });
  state.newTodoInput = '';
});

export const handleNewTodoChange = pipe(
  extractInputValue,
  mutate<string>(({ value, state }) => {
    state.newTodoInput = value;
  })
);
