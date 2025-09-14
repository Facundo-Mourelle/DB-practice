-- Ejercicio 1

SELECT ci.Name, co.Name, ci.Population 
FROM city ci 
JOIN country co 
ON ci.CountryCode = co.Code 
WHERE co.Population < 10000;

