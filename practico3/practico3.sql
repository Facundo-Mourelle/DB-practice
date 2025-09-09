SELECT
    ci.Name AS CityName,
    co.Name AS CountryName,
    co.Region,
    co.GovernmentForm
FROM
    city ci
JOIN country co
    ON (
        ci.CountryCode = co.Code
    )
ORDER BY
    ci.PopulationDESC
LIMIT 10;
