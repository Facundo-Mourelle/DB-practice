-- Ejercicio 1

SELECT ci.Name, co.Name, ci.Population 
FROM city ci 
JOIN country co 
ON ci.CountryCode = co.Code 
WHERE co.Population < 10000;

-- Ejercicio 2

WITH prom_city (promedio) AS (
    SELECT avg(city2.Population) AS promedio
    FROM city AS city2
)
SELECT city1.Name, city1.Population 
FROM city AS city1 
WHERE city1.Population > (SELECT promedio FROM prom_city) 
ORDER BY city1.Population ASC;
