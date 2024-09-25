import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import TodoItem from './component/todoitem';

function App() {
  const [newTodo, setNewTodo] = useState('')

  const [todos, setTodos] = useState([]);
  
  const [filterItem, setFilterItem] = useState([]);

  const [category, setCategory] = useState('all');

  useEffect(()=>{
    const items = localStorage.getItem('todos');
    items && setTodos(JSON.parse(items));
  },[])

  const addtodo = () => {
    const isDuplicateActiveTodo = todos.some(todo => todo.name === newTodo && todo.isActive === true);

  if (isDuplicateActiveTodo) {
    alert('This todo is already active.');
    return; 
  }

    const createTodo = {
      name: newTodo,
      isActive: true,
      id: new Date().getTime() + Math.random(),
    }
    const newTodos = [...todos,createTodo];
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))
    setNewTodo('');
  }
  
  const removeTodo = id => {
    const newTodos = todos.filter(todo => todo.id!==id )
    localStorage.setItem('todos', JSON.stringify(newTodos))
    setTodos(newTodos)
  }
  const doneTodo = id => {
    const newTodos = todos.map(todo =>
    {
      if (todo.id === id) {
        todo.isActive = !todo.isActive;
      }
      return todo;
    }
    );
    localStorage.setItem('todos', JSON.stringify(newTodos));
    setTodos(newTodos)
  }
  const editTodo = (id, newName) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, name: newName }; 
      }
      return todo;
    })
    
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos)); 
  };  
  useEffect(() => {
    if (category === 'all') {
      return setFilterItem([...todos])
    }
    if (category === 'done') {
      const currentItems = todos.filter(item => item.isActive !== true)
      return setFilterItem([...currentItems])
    }
    if (category === 'active') {
      const currentItems = todos.filter(item => item.isActive === true)
      return setFilterItem([...currentItems])
    }
    console.log(todos);
  }, [category, todos])

  const clearTodo = () => {
    setTodos([])
    localStorage.setItem('todos', JSON.stringify([]))
  }

  return (
    <div className="col-md-4 mx-auto px-2">
      <div className="todo justify-content-center mt-5">
        <div className="input-group mb-2 mr-sm-2">
          <input type="text" name='todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} className="form-control" />
          <div className="input-group-append">
            <button className="btn btn-secondary" onClick={addtodo}>Add todo</button>
          </div>
        </div>
      </div>
      <div className="buttons-group col text-center">
        <button
          onClick={() => setCategory('all')}
          className={`btn btn-md shadow mr-2 ${category === 'all' ? 'text-white' : ''}`}> ALL
        </button>
        <button
          onClick={() => setCategory('active')}
          className={`btn btn-md shadow mr-2 ${category === 'active' ? 'text-white' : ''}`}> Active
        </button>
        <button
          onClick={() => setCategory('done')}
          className={`btn btn-md shadow mr-2 ${category === 'done' ? 'text-white' : ''}`}>Done
        </button>
        <button
          onClick={clearTodo}
          className="btn btn-md shadow ">Clear
        </button>
      </div>
      <div className="todo-container mt-4">
        {filterItem.length === 0 ? <p className="text-center text-white"> there is no todo items in <span className="font-weight-bold border-bottom" >{category}</span> categories </p> :
          <ul className="list-group">
            {filterItem.map(todo => <TodoItem todo={todo} key={todo.id} removeTodo={removeTodo} doneTodo={doneTodo} editTodo={editTodo}/>)}
          </ul>}
      </div>

    </div >
  );
}

export default App;
