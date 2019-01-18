export type TodoModel = {
  name: string;
  id: string;
  done: boolean;
};

export type State = {
  title: string;
  todos: Array<TodoModel>;
  newTodoInput: string;
};

export const initialState: State = {
  title: 'My Todos',
  todos: [],
  newTodoInput: '',
};
