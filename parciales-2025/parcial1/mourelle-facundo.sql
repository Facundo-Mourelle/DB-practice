-- Ejercicio 1
-- Listar los 5 clientes que más ingresos han generado a lo largo del tiempo.

SELECT Customers.CustomerID, sum(od.UnitPrice) as total_spent 
FROM Customers 
INNER JOIN Orders 
ON Orders.CustomerID = Customers.CustomerID 
INNER JOIN `Order Details` od 
ON Orders.OrderID = od.OrderID 
GROUP BY Customers.CustomerID 
ORDER BY total_spent DESC 
LIMIT 5;

-- Ejercicio 2
-- Listar cada producto con sus ventas totales, agrupados por categoría.

SELECT 
    Products.ProductID, 
    Products.ProductName, 
    c.CategoryName,
    COUNT(od.Quantity) AS total_sold 
FROM 
    Products 
INNER JOIN 
    `Order Details` od ON Products.ProductID = od.ProductID 
INNER JOIN 
    Categories c ON c.CategoryID = Products.CategoryID 
GROUP BY 
    Products.ProductID, c.CategoryName 
ORDER BY 
    total_sold DESC;

-- Ejercicio 3
-- Calcular el total de ventas para cada categoría

SELECT c.CategoryName, COUNT(od.ProductID) AS total_sold 
FROM Products 
INNER JOIN `Order Details` od ON Products.ProductID = od.ProductID 
INNER JOIN Categories c ON c.CategoryID = Products.CategoryID 
GROUP BY c.CategoryID 
ORDER BY total_sold;

-- Ejercicio 4
-- Crear una vista que liste los empleados con más ventas por cada año, mostrando empleado, año y total de ventas. Ordenar el resultado por año ascendente.

CREATE VIEW BestEmployees AS 
SELECT emp.EmployeeID, year(Orders.OrderDate) AS year_sold, count(*) AS total_sold 
FROM Employees emp 
INNER JOIN Orders 
ON emp.EmployeeID = Orders.EmployeeID 
GROUP BY emp.EmployeeID, year_sold 
ORDER BY year_sold ASC;

-- Ejercicio 5
/*
Crear un trigger que se ejecute después de insertar un nuevo registro en la tabla
Order Details. Este trigger debe actualizar la tabla Products para disminuir la
cantidad en stock (UnitsInStock) del producto correspondiente, restando la
cantidad (Quantity) que se acaba de insertar en el detalle del pedido.
*/

DELIMITER // 
CREATE TRIGGER update_stock 
AFTER INSERT ON `Order Details` 
FOR EACH ROW 
BEGIN 
    DECLARE stock INT;

    SELECT P.UnitsInStock INTO stock 
    FROM Products p 
    WHERE p.ProductID = NEW.ProductID;

    IF (new.Quantity <= stock) THEN
        UPDATE Products 
        SET UnitsInStock = UnitsInStock - NEW.Quantity 
        WHERE Products.ProductID = NEW.ProductID;
    END IF;

END //
DELIMITER ;

-- Ejercicio 6
CREATE ROLE IF NOT EXISTS admin;

GRANT INSERT 
ON northwind.Customers TO admin;

GRANT UPDATE (Phone)
ON northwind.Customers TO admin;
