-- Clean start
DROP DATABASE IF EXISTS world;
CREATE DATABASE IF NOT EXISTS world;

-- Scheme
CREATE TABLE IF NOT EXISTS country(
	Code VARCHAR(150) PRIMARY KEY,
	Name VARCHAR(150),
	Continent VARCHAR(150),
	Region VARCHAR(150),
	SurfaceArea INT,
	IndepYear INT,
	Population INT,
	LifeExpectancy INT,
	GNP INT,
	GNPOld INT,
	LocalName VARCHAR(150),
	GovernmentForm VARCHAR(150),
	HeadOfState VARCHAR(150),
	Capital INT,
	Code2 VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS city (
	ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	Name VARCHAR(150),
	CountryCode VARCHAR(150),
	District VARCHAR(150),
	Population INT,
	FOREIGN KEY (CountryCode) REFERENCES country(Code)
)
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS countrylanguage (
	CountryCode VARCHAR(150) NOT NULL,
	Language VARCHAR(150) NOT NULL,
	IsOfficial VARCHAR(1),
	Percentage DECIMAL(5,2),

	FOREIGN KEY (CountryCode) REFERENCES country(Code),
	PRIMARY KEY (CountryCode, Language)
)
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS continent (
	ContinentName VARCHAR(150) NOT NULL PRIMARY KEY,
	Area INT,
	PercentageLand DECIMAL(5,2),
	MostPopulousCity INT
)
ENGINE=InnoDB;
-- End of Scheme

-- Populate
source ./world-data.sql;

INSERT INTO continent VALUES ('Africa', 30370000, 20.4, 608);
INSERT INTO continent VALUES ('Antarctica', 14000000, 9.2, 4080);
INSERT INTO continent VALUES ('Asia',44579000, 29.5,1024);
INSERT INTO continent VALUES ('Europe',10180000, 6.8,3357);
INSERT INTO continent VALUES ('North America', 24709000, 16.5, 2515);
INSERT INTO continent VALUES ('Oceania',8600000, 5.9,130);
INSERT INTO continent VALUES ('South America', 17840000, 12.0,206);
-- End of Populate

-- Punto 6
ALTER TABLE country
ADD CONSTRAINT fk_country_continent
FOREIGN KEY (Continent) REFERENCES continent(ContinentName);

-- Queries
-- 1
SELECT Name, Region 
FROM country 
ORDER BY Name ASC;
-- 2
SELECT Name, Population 
FROM city 
ORDER BY Population DESC
LIMIT 10;
-- 3
SELECT Name, Region, SurfaceArea, GovernmentForm
FROM country
ORDER BY SurfaceArea ASC
LIMIT 10;
-- 4
SELECT name 
FROM country 
WHERE IndepYear IS NULL 
OR IndepYear = 0;
-- 5
SELECT Language, Percentage 
FROM countrylanguage 
WHERE IsOfficial = "T"; 
-- 6
UPDATE countrylanguage 
SET Percentage = 100 
WHERE CountryCode="AIA";
