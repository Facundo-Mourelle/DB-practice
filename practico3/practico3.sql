-- Ejercicio 1

SELECT
    ci.Name AS CityName,
    co.Name AS CountryName,
    co.Region,
    co.GovernmentForm 
FROM city ci 
JOIN country co
ON (ci.CountryCode = co.Code)
ORDER BY ci.Population DESC
LIMIT 10;

-- Ejercicio 2

SELECT 
co.Name AS CountryName, 
ci.Name AS CityName 
FROM country co 
LEFT JOIN city ci 
ON (co.Capital = ci.ID) 
ORDER BY co.Population ASC 
LIMIT 10;

-- Ejercicio 3

SELECT 
co.Name AS CountryName, 
co.Continent AS Continent, 
la.Language AS Language 
FROM countrylanguage la 
INNER JOIN country co 
ON (co.Code = la.CountryCode) 
WHERE (la.IsOfficial = "T");

-- Ejercicio 4

SELECT 
co.Name as Country, 
ci.Name as City 
FROM country co 
LEFT JOIN city ci 
ON (co.Capital = ci.ID) 
ORDER BY co.SurfaceArea DESC 
LIMIT 20;

-- Ejercicio 5

SELECT 
ci.Name AS City, 
la.language AS OfficialLanguage, 
ci.Population AS CityPopulation, 
la.Percentage AS LanguagePercentage 
FROM city ci 
INNER JOIN country co ON ci.CountryCode = co.Code 
INNER JOIN countrylanguage la ON co.Code = la.CountryCode 
WHERE la.IsOfficial = "T" 
ORDER BY (ci.Population) DESC, (la.Percentage) DESC;

-- Ejercicio 6

(
SELECT Name, Population 
FROM country 
WHERE country.Population > 100 
ORDER BY country.Population DESC 
LIMIT 10
)
UNION ALL
(
SELECT Name, Population 
FROM country 
WHERE country.Population > 100 
ORDER BY country.Population ASC 
LIMIT 10
);

-- Ejercicio 7

(
SELECT 
co.Name, 
la.Language 
FROM country co 
INNER JOIN countrylanguage la 
ON (co.Code = la.CountryCode) 
WHERE la.Language = "English"
)
UNION
(
SELECT 
co.Name, 
la.Language 
FROM country co 
INNER JOIN countrylanguage la 
ON (co.Code = la.CountryCode) 
WHERE la.Language = "French"
);

-- Ejercicio 8

SELECT co.Name 
FROM country co 
WHERE EXISTS (
    SELECT 1 
    FROM countrylanguage la 
    WHERE la.CountryCode = co.Code 
    AND la.Language = "English" 
    AND la.Percentage > 0
)
AND NOT EXISTS (
    SELECT 1 
    FROM countrylanguage la 
    WHERE la.CountryCode = co.Code 
    AND la.Language = "Spanish"
    AND la.Percentage > 0
);

-- PARTE 2

-- Ejercicio 1
/*
Si devuelven los mismos valores puesto que en ambos se seleccionan las filas
usando INNER JOIN lo que descarta las filas entre ambas tablas que poseen
valores que no "matchean" o que tienen valores nulos establecidos por la condicion del ON.
Gracias a esto se puede utilizar AND para filtrar aun mas por la condicion del ON

En el segundo se usa WHERE que descarta tambien las filas que no coinciden con la
condicion establecida, por lo que primero se filtra por la condicion del ON, y luego
se descartan por el filtro establecido en WHERE
*/

-- Ejercicio 2
/*
Usar LEFT JOIN en el caso 1 no seria lo mismo ya que no estariamos seleccionando unicamente
las filas con valores no-nulos, por lo que para los country.Name que no sean "Argentina"
tendriamos el valor NULL

Para el caso 2 con WHERE si se podria usar LEFT JOIN ya que elimina las filas que no coinciden
con la condicion establecida.
*/
