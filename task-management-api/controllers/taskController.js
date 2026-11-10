import initialTasks from '../models/tasks.json' with {type: "json"};
import pool from '../db_conn.js';

const Tasks = {
  tasks:[...initialTasks],

  setTasks(data) {
    this.tasks = data;
  }
}

export const getAllTasks = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT id, title, description, completed, "createdAt" FROM tasks ORDER BY id
    `);

      // Return all tasks
    res.status(200).json(result.rows);
  } catch (error) {
    next(error)
  }
};



export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body ?? {};

    if (typeof title !== 'string' || typeof description !== 'string' || !title.trim() || !description.trim()) {
      return res.status(400).json({ "message": "Title and description required." })
    }

    const result = await pool.query(`
      INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *
    `, [title.trim(), description.trim()]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error)
  }

  // 1. Extract title and description from req.body
  /*const { title, description } = req.body ?? {};
  const date = new Date().toISOString();

  // 2. Validate both fields
  if(typeof title !== 'string' || typeof description !== 'string' || !title.trim() || !description.trim()) {
    return res.status(400).json({ "message": "Title and description required." })
  }

  // 3. Generate a unique numeric ID
  const TID = Math.max(0, ...Tasks.tasks.map(task => task.id)) + 1;

  // 4. Create the new task
  // completed should initially be false
  // createdAt should contain the current date
  const newTask = {
    "id": TID,
    "title": title.trim(),
    "description": description.trim(),
    "completed": false,
    "createdAt": date
  };

  // 5. Add the task immutably using Tasks.setTasks()
  Tasks.setTasks([...Tasks.tasks, newTask]);

  // 6. Return status 201 and the new task
  return res.status(201).json(newTask)*/
};



export const updateTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, completed } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({message: "Invalid task ID"})
    }

    if (typeof title !== 'string' ||
      typeof description !== 'string' || 
      typeof completed !== 'boolean' || 
      !title.trim() || 
      !description.trim()) {
        res.status(400).json({ "message": "Title, description and completion status are required." });
    }

    const result = await pool.query(`
      UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *
    `, [title.trim(), description.trim(), completed, id])

    if (result.rows.length === 0) return res.status(404).json({message: "Task not found."});

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    next(error);
  }


  /*const id = Number(req.params.id);
  const { title, description, completed } = req.body  ?? {};

  if (!Number.isInteger(id) || id <= 0 ) {
    return res.status(400).json({ "message": "Invalid task id" });
  }

  if (
    typeof title !== 'string' ||
     typeof description !== 'string' || 
     typeof completed !== 'boolean' || 
     !title.trim() || 
     !description.trim()
  ) return res.status(400).json({ "message": "Title, description and completion status are required." })

  const foundTask = Tasks.tasks.find(task => task.id === id);

  if(!foundTask) return res.status(404).json({ "message": "Task not found "});

  const updatedTask = {...foundTask, title: title.trim(), description: description.trim(), completed: completed}

  Tasks.setTasks(Tasks.tasks.map(task => (task.id === id ? updatedTask : task)));

  return res.status(200).json(updatedTask)*/
};



export const toggleTaskCompletion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0 ) {
      return res.status(400).json({ "message": "Invalid task id" });
    }

    const result = await pool.query(`
      UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error)
  }
  /*
  // 1. Get the ID from req.params.id
  // 2. Convert and validate the ID
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0 ) {
    return res.status(400).json({ "message": "Invalid task id" });
  }

  // 3. Find the task
  const foundTask = Tasks.tasks.find(task => task.id === id);

  // 4. Return 404 if it doesn't exist
  if(!foundTask) return res.status(404).json({ "message": "Task not found "});

  // 5. Create an updated task with the opposite completed value
  const updatedTask = {...foundTask, completed: !foundTask.completed}

  // 6. Update Tasks.tasks immutably using map()
  Tasks.setTasks(Tasks.tasks.map(task => (task.id === id ? updatedTask : task)));

  // 7. Return the updated task with status 200
  return res.status(200).json(updatedTask);*/
};

export const deleteTask = (req, res) => {
  const id = Number(req.params.id);

  if(!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ "message": "Invalid task ID" });
  }

  const foundTask = Tasks.tasks.find(task => task.id === id);

  if (!foundTask) {
    return res.status(404).json({ "message": "Task not found." })
  }

  const filteredTasks = Tasks.tasks.filter(task => task.id !== foundTask.id);

  Tasks.setTasks(filteredTasks);

  return res.status(204).end();
}

export const getTaskById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({message: "Invalid task ID"});
    }

    const result = await pool.query(`
      SELECT id, title, description, completed, "createdAt" FROM tasks WHERE id = $1
    `, [id])

    if (result.rows.length === 0 ) {
      return res.status(404).json({message: "Task not found."});
    }

    return res.status(200).json(result.rows[0]);

  }  catch (error) {
    next(error)
  }

  /*
  // 1. Get ID from req.params.id
  // 2. Convert it to a number
  const id = Number(req.params.id);

  // 3. Validate the ID
  if(!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ "message": "Invalid task ID" });
  }

  // 4. Find the task
  const foundTask = Tasks.tasks.find(task => task.id === id);

  // 5. Return 404 if it doesn't exist
  if(!foundTask) return res.status(404).json({ "message": "Task not found." });

  // 6. Return the task
  return res.status(200).json(foundTask); */
};