import initialTasks from '../models/tasks.json' with {type: "json"};

const Tasks = {
  tasks:[...initialTasks],

  setTasks(data) {
    this.tasks = data;
  }
}

export const getAllTasks = (req, res) => {
  // Return all tasks
  res.json(Tasks.tasks);
};

export const createTask = (req, res) => {
  // 1. Extract title and description from req.body
  const { title, description } = req.body ?? {};
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
  return res.status(201).json(newTask)
};

export const updateTask = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0 ) {
    return res.status(400).json({ "message": "Invalid task id" });
  }

  const foundTask = Tasks.tasks.find(task => task.id === id);

  if(!foundTask) return res.status(404).json({ "messge": "Task not found "})

  if (req.body.title) foundTask.title = req.body.title;
  if (req.body.description) foundTask.title = req.body.description

  Tasks.setTasks(Tasks.tasks.map(task => (task.id === id ? foundTask : task)));

  return res.status(200).json(foundTask)
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

  const filteredTasks = Tasks.task(task => task.id !== foundTask.id);

  Tasks.setTasks(filteredTasks);

  res.status(204).end();
}

export const getTaskById = (req, res) => {
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
  return res.status(200).json(foundTask);
};