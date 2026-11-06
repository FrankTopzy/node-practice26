/*=====WHERE allows you to retrieve records that satisfy a particular condition=====*/
SELECT * FROM tasks WHERE completed = TRUE;

/*=====Using AND=====*/
SELECT * FROM tasks WHERE completed = FALSE AND user_id = 1;

/*=====Using OR=====*/
SELECT * FROM tasks WHERE user_id = 1 OR user_id = 2;

/*=====Example using IN=====*/
SELECT * FROM tasks WHERE user_id IN (1, 3);

/*=====Example using LIKE=====*/
SELECT * FROM tasks WHERE title LIKE '%Learn%';




/*===== ORDER BY: Suppose you want to arrange tasks by their IDs, from highest to lowest.=====*/
/*=====
  ASC — ascending order.
  DESC — descending order.
=====*/
SELECT * FROM tasks ORDER BY id DESC

SELECT * FROM tasks ORDER BY title ASC;



/*===== LIMIT — Restricting returned records.=====*/
SELECT * FROM tasks LIMIT 5;

SELECT * FROM tasks ORDER BY id DESC LIMIT 3;




/*===== GROUP BY — Grouping records=====*/
SELECT user_id, COUNT(*) AS total_tasks FROM tasks GROUP BY user_id;



/*===== Putting everything together.=====*/
SELECT user_id, COUNT(*) AS incomplete_tasks FROM tasks WHERE completed = FALSE 
GROUP BY user_id HAVING COUNT(*) >= 2
ORDER BY incomplete_tasks DESC LIMIT 5;