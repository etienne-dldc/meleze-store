import { useFragment, useExecutables } from '../logic';
import { Todos } from './Todos';
import { handleNewTodoChange, addTodo } from '../logic/executables';

const App: React.FunctionComponent<{}> = () => {
  const { title, newTodo } = useFragment(state => ({
    title: state.title,
    newTodo: state.newTodoInput,
  }));
  const exec = useExecutables({ handleNewTodoChange, addTodo });

  return (
    <div>
      <h1>{title}</h1>
      <input value={newTodo} onChange={exec.handleNewTodoChange} />
      <button onClick={exec.addTodo}>Add</button>
      <Todos />
    </div>
  );
};
