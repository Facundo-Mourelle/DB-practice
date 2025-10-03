-- Ejercicio 1

/*
Cree una tabla de `directors` con las columnas: Nombre, Apellido, Número de Películas.
*/

DROP TABLE directors;

CREATE TABLE IF NOT EXISTS directors(
    first_name varchar(50),
    last_name varchar(50),
    total_movies int
);

-- Ejercicio 2

/*
El top 5 de actrices y actores de la tabla `actors` que tienen la mayor experiencia (i.e. el mayor número de películas filmadas) son también directores de las películas en las que participaron. Basados en esta información, inserten, utilizando una subquery los valores correspondientes en la tabla `directors`.
*/

INSERT INTO directors (first_name, last_name, total_movies) 
SELECT actor.first_name, actor.last_name, total_movies 
FROM (
    SELECT film_actor.actor_id, count(film_id) as total_movies 
    FROM film_actor 
    GROUP BY film_actor.actor_id 
    ORDER BY total_movies DESC;
    LIMIT 5 
) AS top_5 INNER JOIN actor 
WHERE actor.actor_id = top_5.actor_id;

SELECT * FROM directors;

-- Ejercicio 3

/*
Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de acuerdo a si el cliente es "premium" o no. Por defecto ningún cliente será premium.
*/

SELECT * FROM customer LIMIT 10;

ALTER TABLE customer 
ADD premium_customer CHAR 
DEFAULT 'F';

SELECT * FROM customer;

-- Ejercicio 4

/*
Modifique la tabla customer. Marque con 'T' en la columna `premium_customer` de los 10 clientes con mayor dinero gastado en la plataforma.
*/

UPDATE customer 
JOIN (
    SELECT payment.customer_id 
    FROM payment 
    GROUP BY payment.customer_id 
    ORDER BY sum(payment.amount) 
    LIMIT 10 
) as top 
ON customer.customer_id = top.customer_id 
SET premium_customer = 'T';

SELECT * FROM customer WHERE premium_customer ="T";

-- Ejercicio 5

/*
Listar, ordenados por cantidad de películas (de mayor a menor), los distintos ratings de las películas existentes (Hint: rating se refiere en este caso a la clasificación según edad: G, PG, R, etc).
*/

SELECT rating, count(film_id) AS film_amount 
FROM film 
GROUP BY rating 
ORDER BY film_amount DESC;

-- Ejercicio 6

/*
¿Cuáles fueron la primera y última fecha donde hubo pagos?
*/

(
SELECT payment_date 
FROM payment 
ORDER BY payment_date ASC 
LIMIT 1
)
UNION
(
SELECT payment_date 
FROM payment 
ORDER BY payment_date DESC 
LIMIT 1
);

-- Ejercicio 7

/*
Calcule, por cada mes, el promedio de pagos (Hint: vea la manera de extraer el nombre del mes de una fecha).
*/

SELECT MONTH(payment.payment_date) AS month_num,
    AVG(payment.amount) AS avg_income 
FROM payment 
GROUP BY month_num;

-- Ejercicio 8

/*
Listar los 10 distritos que tuvieron mayor cantidad de alquileres (con la cantidad total de alquileres).
*/

SELECT address.district, count(*) AS rentals 
FROM address 
LEFT JOIN (
    SELECT customer.customer_id, customer.address_id 
    FROM rental 
    INNER JOIN customer 
    ON customer.customer_id = rental.customer_id
) AS customer_rentals 
ON (customer_rentals.address_id = address.address_id) 
GROUP BY address.district 
ORDER BY rentals DESC 
LIMIT 10;

-- Ejercicio 9

/*
Modifique la table `inventory_id` agregando una columna `stock` que sea un número entero y representa la cantidad de copias de una misma película que tiene determinada tienda. El número por defecto debería ser 5 copias.
*/
