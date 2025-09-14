-- Ejercicio 1
/*
Listar el nombre de la ciudad y el nombre del país de todas las ciudades que pertenezcan a países con una población menor a 10000 habitantes.
*/

SELECT ci.Name, co.Name, ci.Population 
FROM city ci 
JOIN country co 
ON ci.CountryCode = co.Code 
WHERE co.Population < 10000;

-- Ejercicio 2
/*
Listar todas aquellas ciudades cuya población sea mayor que la población promedio entre todas las ciudades.
*/

WITH prom_city (promedio) AS (
    SELECT avg(city2.Population) AS promedio
    FROM city AS city2
)
SELECT city1.Name, city1.Population 
FROM city AS city1 
WHERE city1.Population > (SELECT promedio FROM prom_city) 
ORDER BY city1.Population ASC;

-- Ejercicio 3
/*
Listar todas aquellas ciudades no asiáticas cuya población sea igual o mayor a la población total de algún país de Asia.
*/

SELECT Name 
FROM city AS c 
WHERE Population >= SOME (
    SELECT Population 
    FROM country 
    WHERE Continent = "Asia" 
    )
AND c.CountryCode NOT IN (
    SELECT Code
    FROM country 
    WHERE Continent LIKE "Asia"
);

-- Ejercicio 4
/*
Listar aquellos países junto a sus idiomas no oficiales, que superen en porcentaje de hablantes a cada uno de los idiomas oficiales del país.
*/

