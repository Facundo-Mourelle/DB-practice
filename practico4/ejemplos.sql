SELECT DISTINCT course_id
FROM section
WHERE semester = ’Fall’ AND year= 2009 AND
course_id IN (
SELECT course_id 
FROM section
WHERE semester = ’Spring’ 
    AND year= 2010);

SELECT name
FROM instructor
WHERE name NOT IN (’Mozart’, ’Einstein’);

SELECT name
FROM instructor
WHERE salary > ALL (
        SELECT salary
        FROM instructor
        WHERE dept_name = ’Biology’
        );

SELECT course
FROM section AS S
WHERE semester = ’Fall’ 
   AND year= 2009 
   AND EXISTS (
        SELECT *
        FROM section AS T
        WHERE semester = ’Spring’ 
           AND year= 2010 
           AND S.course_id = T.course_id
    )

-- TODO: “tabla A contiene a tabla B” == “not exists (B except A).”

-- Renombrar tablas en una consulta:
SELECT t.ID, i.ID 
FROM instructor AS i, teaches t

-- NOTE: Un query retorna una tabla y por lo tanto puede aparecer en otra query en cualquier lugar donde una tabla es esperada.

SELECT dept name, avg_salary
FROM (
    SELECT dept_name, 
  avg (salary) as avg_salary 
    FROM instructor  
    GROUP BY dept_name
) WHERE avg_salary > 42000;

-- WARNING: Subqueries en un FROM no pueden usar nombres de correlación de otras tablas en el FROM.

-- NOTE: Podemos utilizar una subconsulta donde se espera una expresión siempre que la consulta retorne una fila con una sola columna. Tales consultas se denominan CONSULTAS ESCALARES.

SELECT d.dept_name, (SELECT count(*)
      FROM instructor i
      WHERE d.dept_name =  i.dept_name
     ) AS num_instructors
FROM department d;

-- NOTE: con WITH definimos tablas temporales que estan disponibles en la query asociada al with

WITH 
     max_budget (value) AS (
          SELECT max(budget) 
          FROM department
     )
 SELECT budget
 FROM department, max_budget
 WHERE department.budget = max_budget.value

-- NOTE: funciones agregadas
/*
AVG, COUNT, MAX, MIN, SUM
*/

-- NOTE: agrupaciones
SELECT select_expr
FROM table_expr
WHERE where_condition
HAVING where_condition
GROUP BY {col|alias|pos}
ORDER BY order_expr

-- NOTE: HAVING permite filtrar grupos sobre los valores agregados.
-- WARNING: El predicado de HAVING se chequea luego de que los grupos son computados.
-- WARNING: El predicado del WHERE se chequea antes de que los grupos sean computados.

SELECT dept_name,
        avg(salary) AS salary
FROM instructor
GROUP BY dept_name
HAVING avg(salary) > 42000;
