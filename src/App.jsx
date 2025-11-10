import React, { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("all"); // new filter state

  // Load from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedTasks) setTasks(savedTasks);
    if (savedMode) setDarkMode(savedMode);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addOrEditTask = () => {
    if (task.trim() === "") return;

    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, text: task.trim() } : t
        )
      );
      setEditId(null);
    } else {
      const newTask = { id: Date.now(), text: task.trim(), completed: false };
      setTasks([...tasks, newTask]);
    }

    setTask("");
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const toggleComplete = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  const editTask = (id) => {
    const toEdit = tasks.find((t) => t.id === id);
    setTask(toEdit.text);
    setEditId(id);
  };

  const clearAll = () => {
    setTasks([]);
    localStorage.removeItem("tasks");
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div
      className={`min-vh-100 d-flex justify-content-center align-items-center ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div className="container">
        <div className={`card shadow-lg ${darkMode ? "bg-secondary text-light" : ""}`}>
          <div
            className={`card-header d-flex justify-content-between align-items-center ${
              darkMode ? "bg-dark text-light" : "bg-primary text-white"
            }`}
          >
            <h3>📝 To-Do List</h3>
            <button
              className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"}`}
              onClick={toggleTheme}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <div className="card-body">
            {/* Add / Edit input */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter a new task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addOrEditTask()}
              />
              <button
                className={`btn ${editId ? "btn-warning" : "btn-success"}`}
                onClick={addOrEditTask}
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>

            {/* Filter buttons */}
            <div className="d-flex justify-content-center mb-3">
              <button
                className={`btn btn-sm mx-1 ${
                  filter === "all" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`btn btn-sm mx-1 ${
                  filter === "completed" ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`btn btn-sm mx-1 ${
                  filter === "pending" ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
            </div>

            {/* Task list */}
            {filteredTasks.length === 0 ? (
              <p className="text-center text-muted">No tasks to display.</p>
            ) : (
              <ul className="list-group">
                {filteredTasks.map((t) => (
                  <li
                    key={t.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      darkMode ? "bg-dark text-light" : ""
                    }`}
                  >
                    <span
                      style={{
                        textDecoration: t.completed ? "line-through" : "none",
                        color: t.completed ? "gray" : darkMode ? "white" : "black",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleComplete(t.id)}
                    >
                      {t.text}
                    </span>

                    <div>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => editTask(t.id)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteTask(t.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card-footer text-center">
            {tasks.length > 0 && (
              <button className="btn btn-outline-danger btn-sm" onClick={clearAll}>
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

