import { useFragment, fragment } from '../logic';
import { Todo } from './Todo';

export const Todos: React.FunctionComponent = () => {
  const todoIds = useFragment(state => state.todos.map(todo => todo.id));

  return (
    <div>
      {todoIds.map(todoId => (
        <Todo key={todoId} todoId={todoId} />
      ))}
    </div>
  );
};
