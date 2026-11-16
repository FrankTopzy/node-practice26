CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);


CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	completed BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    bio TEXT,
    user_id INTEGER UNIQUE REFERENCES users(id)
);

CREATE TABLE enrollments (
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),

    PRIMARY KEY (student_id, course_id)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE task_tags (
    task_id INTEGER REFERENCES tasks(id),
    tag_id INTEGER REFERENCES tags(id),

    PRIMARY KEY (task_id, tag_id) 
);


ALTER TABLE tasks ADD COLUMN description TEXT; /*TO ADD A NEW COLUMN*/


ALTER TABLE tasks RENAME COLUMN created_at TO "createdAt"; /*Edit the title of an existing column*/


SELECT tasks.title, users.name FROM tasks INNER JOIN users ON tasks.user_id = users.id;

SELECT created_at AS "createdAt"
FROM tasks;



SELECT users.name, tasks.title
FROM users
LEFT JOIN tasks
ON users.id = tasks.user_id;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tasks'
ORDER BY ordinal_position;

SELECT
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name = 'email';

SELECT checksum AS stored_checksum
FROM "_prisma_migrations"
WHERE migration_name = '0_init';

UPDATE "_prisma_migrations"
SET checksum = 'a3874c5c0bb4c770a9e4f053c2eedc1636d242cbc2e5aa10871b3b4178e5a2a9'
WHERE migration_name = '0_init'
AND checksum = '6370548c1ef02762b4d8a1e8d5f69073043f2e3589a3735cffc89acaeb17c768'
AND finished_at IS NOT NULL
AND rolled_back_at IS NULL
RETURNING migration_name, checksum;



SELECT users.name, tasks.title
FROM users
RIGHT JOIN tasks
ON users.id = tasks.user_id;


SELECT u.name, t.title
FROM users AS u
INNER JOIN tasks AS t
ON u.id = t.user_id;


SELECT users.name, tasks.title
FROM tasks
INNER JOIN users
ON tasks.user_id = users.id
WHERE users.name = 'Frank';


SELECT
    id,
    title,
    (
        SELECT name
        FROM users
        WHERE users.id = tasks.user_id
    ) AS owner
FROM tasks;


/*PRISMA*/
const users = await prisma.users.findMany();


const user = await prisma.users.findUnique({
  where: {
    id: 1
  }
});



const tasks = await prisma.tasks.findMany({
  where: {
    completed: true
  }
});



const tasks = await prisma.tasks.findMany({
  where: {
    completed: true,
    user_id: 1
  }
});


const tasks = await prisma.tasks.findMany({
  select: {
    title: true,
    completed: true
  }
});


const tasks = await prisma.tasks.findMany({
  where: {
    title: {
      contains: 'Express'
    }
  }
});

/*One useful detail: PostgreSQL string matching with Prisma's contains is case-sensitive by default. You can make it case-insensitive with mode: 'insensitive'.*/
const tasks = await prisma.tasks.findMany({
  where: {
    title: {
      contains: 'express',
      mode: 'insensitive'
    }
  }
});


const tasks = await prisma.tasks.findMany({
  where: {
    OR: [
      { completed: true },
      { user_id: 2 }
    ]
  }
});


const tasks = await prisma.tasks.findMany({
  orderBy: {
    id: 'desc'
  }
});


const tasks = await prisma.tasks.findMany({
  orderBy: {
    id: 'desc'
  },
  take: 2
});


const tasks = await prisma.tasks.findMany({
  orderBy: {
    id: 'asc'
  },
  skip: 1,
  take: 2
});


/*Creating a record with Prisma*/
const newTask = await prisma.tasks.create({
  data: {
    title: 'Learn Prisma',
    description: 'Practice Prisma CRUD operations',
    completed: false,
    user_id: 1
  }
});



const updatedTask = await prisma.tasks.update({
  where: {
    id: 4
  },
  data: {
    completed: true
  }
});


const deletedTask = await prisma.tasks.delete({
  where: {
    id: 4
  }
});


const user = await prisma.users.findUnique({
  where: { id: 1 },
  include: {
    tasks: true
  }
});

const user = await prisma.users.findUnique({
  where: { id: 2 },
  include: {
    tasks: true
  }
});

const user = await prisma.users.findUnique({
  where: { id: 2 },
  include: {
    tasks: {
      where: {
        completed: true
      }
    }
  }
});


include: {
  tasks: {
    select: {
      id: true,
      title: true
    }
  }
}

const user = await prisma.users.findUnique({
    where: { id: 1 },
    include: {
      tasks: {
        where: {
          completed: false
        },
        select: {
          id: true,
          title: true
        },
        orderBy: { id: 'desc' }
      }
    }
  });
  

  const users = await prisma.users.findMany({
  where: {
    tasks: {
      some: {
        completed: false
      }
    }
  }
});


/*some: { completed: true } → at least one completed task exists.



every: { completed: true } → every task is completed.



none: { completed: true } → no completed tasks exist.*/


const users = await prisma.users.findMany({
  where: {
    tasks: {
      some: {
        completed: true
      }
    }
  },
  include: {
    tasks: {
      where: {
        completed: true
      }
    }
  }
});

const totalTasks = await prisma.tasks.count();

console.log(totalTasks);


const completedTasks = await prisma.tasks.count({
  where: {
    completed: true
  }
});

console.log(completedTasks);


const incompleteTasks = await prisma.tasks.count({
  where: {
    completed: false,
    user_id: 2
  }
});

const result = await prisma.tasks.aggregate({
  _max: {
    id: true
  }
});

console.log(result);

/*Prisma's aggregate() can calculate values such as:
- _count — number of records.
- _avg — average.
- _sum — total.
- _min — minimum.
- _max — maximum.*/

const result = await prisma.tasks.groupBy({
  by: ['completed'],
  _count: {
    id: true
  }
});

const taskGroups = await prisma.tasks.groupBy({
  by: ['user_id'],
  _count: {
    id: true
  },
  having: {
    id: {
      _count: {
        gte: 2
      }
    }
  }
});



const result = await prisma.$transaction(async (tx) => {
  const user = await tx.users.create({
    data: {
      name: 'David',
      email: 'david@example.com'
    }
  });

  const task = await tx.tasks.create({
    data: {
      title: 'Learn Prisma',
      description: 'Understand transactions',
      user_id: user.id
    }
  });

  return { user, task };
});

/*Transactions follow the ACID principles:
- Atomicity: All operations succeed or none do.
- Consistency: The database remains valid.
- Isolation: Concurrent transactions are kept appropriately separate.
- Durability: Committed changes persist.*/