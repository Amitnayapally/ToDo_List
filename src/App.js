import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');

  // Fetch tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage on update
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === '') {
      alert("Task cannot be empty");
      return;
    }

    const newTask = { id: Date.now(), text: task, completed: false };
    setTasks([...tasks, newTask]);
    setTask('');
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleCompleteTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id, text) => {
    setEditTaskId(id);
    setTaskText(text);
  };

  const saveEditTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: taskText } : task
    ));
    setEditTaskId(null);
    setTaskText('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === 'alphabetical') return a.text.localeCompare(b.text);
    if (sort === 'reverse-alphabetical') return b.text.localeCompare(a.text);
    return 0;
  });

  return (
    <div className="App">
      <div className="todo-container">
        <h1>React To-Do List</h1>
        <div className="task-input">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task"
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <div className="controls">
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <select onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="reverse-alphabetical">Reverse Alphabetical</option>
          </select>
        </div>
        <ul className="task-list">
          {sortedTasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleteTask(task.id)}
              />
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                  />
                  <button className="save-button" onClick={() => saveEditTask(task.id)}>Save</button>
                </>
              ) : (
                <>
                  <span className="task-text">{task.text}</span>
                  <div className="task-actions">
                    <button className="edit-button" onClick={() => editTask(task.id, task.text)}>Edit</button>
                    <button className="remove-button" onClick={() => removeTask(task.id)}>Remove</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
