import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { uuid } from 'uuidv4';
import { ITODO } from './utils';
import {
  deleteTodo,
  fetchAllTodos,
  initTable,
  insertTodo,
  registerIpcListener,
  updateTodo,
  updateTodoOrdeId,
} from './sqliteUtils';

function App() {
  const [todoContent, setTodoContent] = useState('');
  const [todos, setTodos] = useState<ITODO[]>([]);

  const todoInputRef = useRef<any>(null);

  const onDeleteTodo = (index: number) => {
    const todo = todos[index];
    todos.splice(index, 1);
    setTodos([...todos]);
    deleteTodo(todo);
  };

  const handleToggle = (todo: ITODO) => {
    console.log(todo);
    const todoIndex = todos.findIndex((t) => t.id === todo.id);
    if (todoIndex === -1) {
      console.error('invalid todo index');
      return;
    }
    todos[todoIndex].isCompleted = !todo.isCompleted;
    setTodos([...todos]);
  };

  const onCreateTodo = () => {
    if (!todoContent) return;
    const tempTodo = {
      id: uuid(),
      content: todoContent,
      isCompleted: false,
      orderId: todos.length + 1,
    };
    insertTodo(tempTodo);
    setTodos([tempTodo, ...todos]);
    setTodoContent('');
  };

  const handleEditTodo = (e: any, index: number) => {
    const todo = todos[index];
    if (e.target.value !== todo.content) {
      todo.content = e.target.value;
      updateTodo(todo);
      setTodos([...todos]);
    }
  };

  const reorderTodos = (args: any[]) => {
    if (Array.isArray(args)) {
      const todos = Array.from(args);
      setTodos(todos.sort((a, b) => (a.orderId > b.orderId ? -1 : 1)));
    }
  };

  useEffect(() => {
    registerIpcListener(reorderTodos);
    fetchAllTodos();
    initTable();
  }, []);

  const onPressEnter = (event: any, cb: any) => {
    if (event.keyCode === 13) {
      cb();
    }
  };

  const onChangeOrder = (event: any, index: number) => {
    if (event.keyCode === 38) {
      console.log('upKey pressed');
      if (index !== 0) {
        const tmpOrderIndex = todos[index].orderId;
        todos[index].orderId = todos[index - 1].orderId;
        todos[index - 1].orderId = tmpOrderIndex;
        reorderTodos([...todos]);
        updateTodoOrdeId(todos[index]);
        updateTodoOrdeId(todos[index - 1]);
      }
    } else if (event.keyCode === 40) {
      console.log('downKey pressed');
      if (index + 1 !== todos.length) {
        const tmpOrderIndex = todos[index].orderId;
        todos[index].orderId = todos[index + 1].orderId;
        todos[index + 1].orderId = tmpOrderIndex;
        reorderTodos([...todos]);
        updateTodoOrdeId(todos[index]);
        updateTodoOrdeId(todos[index + 1]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', function (e) {
      if (e.altKey === true && e.keyCode === 78) {
        console.log('Alt + N');
        todoInputRef.current.focus();
      }
    });
  }, []);

  return (
    <>
      <Card style={{ width: 450 }} variant="outlined">
        <CardContent>
          <Typography className="my-2">TODOS:</Typography>
          <div className="overflow-y-auto" style={{ height: '60vh' }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {todos.map((todo, index) => {
                const labelId = `checkbox-list-secondary-label-${todo.id}`;
                return (
                  <ListItem
                    tabIndex={todos.length + index}
                    key={todo.id}
                    onKeyDown={(e) => onChangeOrder(e, index)}
                    secondaryAction={
                      <IconButton onClick={() => onDeleteTodo(index)}>
                        <ClearIcon />
                      </IconButton>
                    }
                  >
                    <Checkbox
                      onClick={() => handleToggle(todo)}
                      onKeyUp={(e) => onPressEnter(e, () => handleToggle(todo))}
                      checked={todo.isCompleted}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                    <input
                      type="text"
                      onBlur={(e) => handleEditTodo(e, index)}
                      className={`pl-1 ${
                        todo.isCompleted ? 'line-through' : ''
                      }`}
                      defaultValue={todo.content}
                    />
                  </ListItem>
                );
              })}
            </List>
          </div>
          <div className="flex items-center justify-between px-4 mt-4 pt-4">
            <TextField
              label="Enter task"
              size="small"
              inputRef={todoInputRef}
              onKeyUp={(e) => onPressEnter(e, onCreateTodo)}
              value={todoContent}
              onChange={(e) => setTodoContent(e.target.value)}
              variant="outlined"
            />

            <Button
              onKeyUp={(e) => onPressEnter(e, onCreateTodo)}
              onClick={onCreateTodo}
              variant="outlined"
            >
              Add todo
            </Button>
          </div>
          <p className="mt-3 ml-4 text-xs">
            Hint: use <strong>ALT+ N</strong> to create new todo
          </p>
        </CardContent>
      </Card>
    </>
  );
}

export default App;
