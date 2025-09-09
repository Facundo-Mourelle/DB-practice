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
