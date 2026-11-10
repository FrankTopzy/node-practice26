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


