import { useFragment, fragment, useExecutables } from '../logic';
import { TodoModel } from '../logic/state';
import { toggleTodo } from '../logic/executables';

type Props = {
  todoId: string;
};

const todoFragment = fragment<TodoModel, string>('todo', (state, todoId) =>
  state.todos.find(todo => todo.id === todoId)
);

export const Todo: React.FunctionComponent<Props> = ({ todoId }) => {
  const todo = useFragment(todoFragment, todoId);
  const exec = useExecutables({ toggleTodo });

  return (
    <div>
      <h3 onClick={() => exec.toggleTodo(todoId)}>
        {todo.done ? '✅' : '❎'} {todo.name}
      </h3>
    </div>
  );
};
