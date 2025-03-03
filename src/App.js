import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import TodoItem from "./component/todoitem";
import AuthWrapper from "./component/authWrapper";

function App() {
  const [newTodo, setNewTodo] = useState("");

  const [todos, setTodos] = useState([]);
  const [filterItem, setFilterItem] = useState([]);
  const [priority,setPriority]=useState('');
  const[error,setError]=useState('');

  const [category, setCategory] = useState("all");

  useEffect(() => {
    const items = localStorage.getItem("todos");
    items && setTodos(JSON.parse(items));
  }, []);

  const addtodo = (req,res) => {
    setError(false);
    const isDuplicateActiveTodo = todos.some(
      (todo) => todo.name === newTodo && todo.isActive === true
    );

    if (isDuplicateActiveTodo) {
      alert("This todo is already active.");
      return;
    }
    if (newTodo && priority<=100 && priority>=0) {
      const createTodo = {
        name: newTodo,
        isActive: true,
        id: new Date().getTime() + Math.random(),
        priority: parseInt(priority),
      };
      const newTodos=[...todos, createTodo];
      setTodos((newTodos).sort((a, b) => b.priority - a.priority));
      localStorage.setItem("todos", JSON.stringify(newTodos));
      setNewTodo('');
      setPriority('');  
    }   
    else{
      setError(true);
    }
  };
  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };
  const doneTodo = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isActive = !todo.isActive;
      }
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };
  const editTodo = (id, newName) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, name: newName };
      }
      return todo;
    });

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };
  useEffect(() => {
    if (category === "all") {
      return setFilterItem([...todos]);
    }
    if (category === "done") {
      const currentItems = todos.filter((item) => item.isActive !== true);
      return setFilterItem([...currentItems]);
    }
    if (category === "active") {
      const currentItems = todos.filter((item) => item.isActive === true);
      return setFilterItem([...currentItems]);
    }
    if (category === "clear") {
      setFilterItem([]);
      return;
    }
    console.log(todos);
  }, [category, todos]);

  const clearTodo = () => {
    setTodos([]);
    localStorage.setItem("todos", JSON.stringify([]));
    setCategory("clear");
    console.log(todos);
  };

  const addOnKeyDown = (e) => {
    if (e.key === 'Enter') {
      addtodo()
    }
  }
  return (
    <AuthWrapper>
      {error?    
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        Give proper values
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
        </button>
    </div>:<></>}
      <div className="col-md-4 mx-auto px-2">
        <div className="todo justify-content-center mt-5">
          <div className="input-group mb-2 mr-sm-2">
            <input
              type="text"
              name="todo"
              placeholder="Enter Task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="form-control"
              onKeyDown={(e) => {addOnKeyDown(e)}}
            />
            <input 
                type="number" 
                name="priority"
                placeholder="Set The Priority only from (1 to 100)"
                value={priority} 
                onChange={(e) => setPriority(e.target.value)} 
                className="form-control"
                onKeyDown={(e) => {addOnKeyDown(e)}}
            />
            <div className="input-group-append">
              <button className="btn btn-secondary" onClick={addtodo}>
                Add todo
              </button>
            </div>
          </div>
        </div>
        <div className="buttons-group col text-center">
          <button
            onClick={() => setCategory("all")}
            className={`btn btn-md shadow mr-2 ${
              category === "all" ? "text-white bg-primary" : "text-dark"
            }`}
          >
            {" "}
            ALL
          </button>
          <button
            onClick={() => setCategory("active")}
            className={`btn btn-md shadow mr-2 ${
              category === "active" ? "text-white bg-primary" : "text-dark"
            }`}
          >
            {" "}
            Active
          </button>
          <button
            onClick={() => setCategory("done")}
            className={`btn btn-md shadow mr-2 ${
              category === "done" ? "text-white bg-primary" : "text-dark"
            }`}
          >
            Done
          </button>
          <button
            onClick={clearTodo}
            className={`btn btn-md shadow ${
              category === "clear" ? "text-white bg-primary" : ""
            }`}
          >
            {" "}
            Clear{" "}
          </button>
        </div>
        <div className="todo-container mt-4">
          {filterItem.length === 0 ? (
            <p className="text-center text-black">
              {" "}
              There is no todo items in{" "}
              <span className="font-weight-bold border-bottom">
                {category}
              </span>{" "}
              categories{" "}
            </p>
          ) : (
            <ul className="list-group">
              {filterItem.map((todo) => (
                <TodoItem
                  todo={todo}
                  key={todo.id}
                  removeTodo={removeTodo}
                  doneTodo={doneTodo}
                  editTodo={editTodo}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}

export default App;
