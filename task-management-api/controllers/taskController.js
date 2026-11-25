import prisma from '../prisma_db.js';


export const getAllTasks = async (req, res, next) => {
  try {
   const { completed } = req.validatedQuery;

   const tasks = await prisma.tasks.findMany({
      where: {
        user_id: req.user.id,
        ...(completed !== undefined && { completed })
      },
      orderBy: {
        id: "asc"
      }
    });

      // Return all tasks
    res.status(200).json(tasks);
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

    const task = await prisma.tasks.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        user_id: req.user.id
      }
    })

    res.status(201).json(task);
  } catch (error) {
    next(error)
  }
};



export const updateTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const { title, description, completed, priority } = req.body;

    const updatedTask = await prisma.tasks.update({
      where: { 
        id,
        user_id: req.user.id
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority })
      }
    });

    return res.status(200).json(updatedTask);

  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    next(error);
  }
};



export const toggleTaskCompletion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const task = await prisma.tasks.findUnique({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        id,
        user_id: req.user.id,
      },
      data: {
        completed: !Boolean(task.completed)
      }
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error)
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedTask = await prisma.tasks.deleteMany({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (deletedTask.count === 0) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    return res.status(204).end();

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found.' });
    }

    next(error);
  }
}

export const getTaskById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await prisma.tasks.findFirst({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found.'
      });
    }

    return res.status(200).json(task);

  }  catch (error) {
    next(error)
  }
};