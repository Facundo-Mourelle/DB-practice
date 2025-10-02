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
AND c.CountryCode IN (
    SELECT Code
    FROM country 
    WHERE Continent NOT LIKE "Asia"
);

-- Ejercicio 4
/*
Listar aquellos países junto a sus idiomas no oficiales, que superen en porcentaje de hablantes a cada uno de los idiomas oficiales del país.
*/

SELECT c.Name, l.Language 
FROM country c 
INNER JOIN countrylanguage l 
ON c.Code = l.CountryCode 
WHERE l.IsOfficial NOT LIKE "T"
AND l.Percentage > ALL (
    SELECT l2.Percentage 
    FROM countrylanguage l2 
    WHERE l2.CountryCode = c.Code 
    AND IsOfficial = "T"
);

-- Ejercicio 5
/*
Listar (sin duplicados) aquellas regiones que tengan países con una superficie menor a 1000 km2 y exista (en el país) al menos una ciudad con más de 100000 habitantes. (Hint: Esto puede resolverse con o sin una subquery, intenten encontrar ambas respuestas).
*/

SELECT DISTINCT c.Region 
FROM country c 
WHERE c.SurfaceArea < 1000 
AND EXISTS (
    SELECT 1
    FROM city ci 
    WHERE c.Code = ci.CountryCode 
    AND ci.Population > 100000
);

SELECT c.Region 
FROM country c 
JOIN city ci 
ON ci.CountryCode = c.Code 
WHERE c.SurfaceArea < 1000 
GROUP BY c.Region 
HAVING MAX(ci.Population) > 100000;

-- Ejercicio 6
/*
Listar el nombre de cada país con la cantidad de habitantes de su ciudad más poblada. (Hint: Hay dos maneras de llegar al mismo resultado. Usando consultas escalares o usando agrupaciones, encontrar ambas).
*/

-- Consulta escalar
SELECT c.name, 
    (SELECT max(Population)
    FROM city ci 
    WHERE c.Code = ci.CountryCode
    ) AS max_pop 
FROM country c;

-- Agregacion
SELECT co.name, MAX(ci.Population) AS max_pop 
FROM country co 
JOIN city ci ON co.Code = ci.CountryCode 
GROUP BY co.Code, co.name;
-- BUG: Si country no tiene una fila city no se muestra (por JOIN + GROUP BY)

-- Ejercicio 7

/*
Listar aquellos países y sus lenguajes no oficiales cuyo porcentaje de hablantes sea mayor al promedio de hablantes de los lenguajes oficiales.
*/

SELECT c.Name, cl.language 
FROM country c 
JOIN countrylanguage cl ON c.Code = cl.CountryCode 
WHERE cl.IsOfficial = 'F' 
AND cl.Percentage > (
    SELECT AVG(cl2.Percentage) 
    FROM countrylanguage cl2 
    WHERE cl2.CountryCode = c.Code 
    AND cl2.IsOfficial = 'T'
);

-- Ejercicio 8

/*
Listar la cantidad de habitantes por continente ordenado en forma descendente.
*/

SELECT co.ContinentName, (SELECT sum(Population) 
    FROM country c 
    WHERE c.Continent = co.ContinentName 
    ) AS pop 
FROM continent co 
GROUP BY co.ContinentName 
ORDER BY pop desc;

-- Ejercicio 9

/*
Listar el promedio de esperanza de vida (LifeExpectancy) por continente con una esperanza de vida entre 40 y 70 años.
*/

SELECT Continent, AVG(LifeExpectancy) AS avg_life 
FROM country 
GROUP BY Continent 
HAVING AVG(LifeExpectancy) BETWEEN 40 AND 70;

-- Ejercicio 10

/*
Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.
*/

SELECT Continent,
    MAX(Population) AS max_pop,
    MIN(Population) AS min_pop,
    AVG(Population) AS avg_pop,
    SUM(Population) AS total_pop 
FROM country 
GROUP BY Continent;
