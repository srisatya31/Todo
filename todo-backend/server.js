const express = require('express');
const cors = require('cors');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(ClerkExpressRequireAuth({}));

let todos = [];

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const newTodo = req.body;
    if (!newTodo.name || newTodo.priority > 100 || newTodo.priority < 0) {
        return res.status(400).json({ error: 'invalid todo data' });
    }
    newTodo.id = Date.now();
    newTodo.isActive = true;
    todos.push(newTodo);
    todos.sort((a, b) => b.priority - a.priority);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTodo = req.body;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex !== -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
        res.json(todos[todoIndex]);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter((todo) => todo.id !== id);
    res.sendStatus(204);
});

app.get('/', (req, res) => {
    res.send('Todo Backend is running!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
