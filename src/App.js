
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import TodoItem from "./component/todoitem";
import AuthWrapper from "./component/authWrapper";

function App() {
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState();
    const [filterItem, setFilterItem] = useState([]);
    const [priority, setPriority] = useState("");
    const [error, setError] = useState("");
    const [category, setCategory] = useState("all");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch("http://localhost:5000/todos");
            if (!response.ok) {
                throw new Error("Failed to fetch todos");
            }
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const addtodo = async () => {
        setError("");
        if (!newTodo) {
            setError("Todo name is required.");
            return;
        }
        if (isNaN(priority) || priority < 0 || priority > 100) {
            setError("Priority must be a number between 0 and 100.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newTodo, priority: parseInt(priority) }),
            });
            if (!response.ok) {
                throw new Error("Failed to add todo");
            }
            setNewTodo("");
            setPriority("");
            fetchTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
            setError("Failed to add todo. Please try again.");
        }
    };

    const removeTodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/todos/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to remove todo");
            }
            fetchTodos();
        } catch (error) {
            console.error("Error removing todo:", error);
        }
    };

    const doneTodo = async (id, isActive) => {
        try {
            const response = await fetch(`http://localhost:5000/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive: !isActive }),
            });
            if (!response.ok) {
                throw new Error("Failed to update todo");
            }
            fetchTodos();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const editTodo = async (id, newName) => {
        try {
            const response = await fetch(`http://localhost:5000/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newName }),
            });
            if (!response.ok) {
                throw new Error("Failed to edit todo");
            }
            fetchTodos();
        } catch (error) {
            console.error("Error editing todo:", error);
        }
    };

    useEffect(() => {
        if (!todos) return;
        if (category === "all") {
            setFilterItem([...todos]);
        }
        if (category === "done") {
            const currentItems = todos.filter((item) => item.isActive !== true);
            setFilterItem([...currentItems]);
        }
        if (category === "active") {
            const currentItems = todos.filter((item) => item.isActive === true);
            setFilterItem([...currentItems]);
        }
        if (category === "clear") {
            setFilterItem([]);
        }
    }, [category, todos]);

    const clearTodo = async () => {
        const doneTodos = todos.filter(todo => todo.isActive === false);
        for (const todo of doneTodos) {
            await removeTodo(todo.id);
        }
        setCategory("clear");
    };

    return (
        <AuthWrapper>
            {error && (
                <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                    ></button>
                </div>
            )}
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
                        />
                        <input
                            type="number"
                            name="priority"
                            placeholder="Set The Priority only from (1 to 100)"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="form-control"
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
                        className={`btn btn-md shadow ${category === "all" ? "text-white bg-primary" : ""}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setCategory("active")}
                        className={`btn btn-md shadow ${category === "active" ? "text-white bg-primary" : ""}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setCategory("done")}
                        className={`btn btn-md shadow ${category === "done" ? "text-white bg-primary" : ""}`}
                    >
                        Done
                    </button>
                    <button
                        onClick={clearTodo}
                        className={`btn btn-md shadow ${category === "clear" ? "text-white bg-primary" : ""}`}
                    >
                        Clear
                    </button>
                </div>
                <div className="todo-container mt-4">
                    {filterItem.length === 0 ? (
                        <p className="text-center text-black">
                            there is no todo items in
                            <span className="font-weight-bold border-bottom">
                                {category}
                            </span>
                            categories
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