-- 1. Obtener los usuarios que han gastado más en reservas

SELECT payments.user_id, users.name, sum(payments.amount) as total_user_pay
FROM payments
    JOIN users ON payments.user_id = users.id
GROUP BY
    payments.user_id
ORDER BY total_user_pay DESC;

-- 2. Obtener las 10 propiedades con el mayor ingreso total por reservas
SELECT properties.id, properties.name, properties.location, sum(bookings.total_price)
FROM properties
    JOIN bookings ON properties.id = bookings.property_id
GROUP BY
    properties.id
ORDER BY sum(bookings.total_price) DESC
LIMIT 10;

-- 3. Crear un trigger para registrar automáticamente reseñas negativas en la tabla de
-- mensajes. Es decir, el owner recibe un mensaje al obtener un review menor o igual a 2.

DELIMITER $$
CREATE TRIGGER mensaje_mala_review 
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE dueno_id INT;

    IF (NEW.rating <= 2) THEN
        SELECT owner_id into dueno_id 
        FROM properties 
        WHERE properties.id = NEW.property_id;

        INSERT INTO messages 
        VALUES (NULL, 1741, dueno_id, NEW.property_id, 'te dejaron mala review', NULL); 
    END IF;
END $$
DELIMITER ;

SELECT *
FROM messages
WHERE content = 'te dejaron mala review'

INSERT INTO reviews VALUES (NULL, 1351, 1741, 1697, 2, 'muy malo', NULL)

SELECT *
FROM reviews
WHERE comment = 'muy malo'


-- 4. Crear un procedimiento Crear un procedimiento llamado process
-- _payment que:
-- Reciba los siguientes parámetros:
-- - input
-- _
-- booking_
-- id (INT): El ID de la reserva.
-- - input
-- user
-- _
-- _
-- id (INT): El ID del usuario que realiza el pago.
-- - input
-- _
-- amount (NUMERIC): El monto del pago.
-- - input
-- _payment
-- _
-- method (VARCHAR): El método de pago utilizado (por ejemplo,
-- "credit
-- card"
-- ,
-- _
-- "paypal").
-- Requisitos: verificar si la reserva asociada existe y está en estado confirmed. Insertar
-- un nuevo registro en la tabla payments. Actualizar el estado de la reserva a paid.
-- No es necesario manejar errores ni transacciones en este procedimiento.


SELECT payments.booking_id,sum(payments.amount)
FROM payments
-- WHERE payments.booking_id = 1400
GROUP BY payments.booking_id
HAVING payments.booking_id = 1400;

SELECT *
FROM bookings
WHERE id=1400;

CALL process_payment(1400, 1742, 3000, 'bank_transfer')

CALL process_payment(1400, 1742, 3000, 'credit_card')

DROP PROCEDURE IF EXISTS process_payment;
DELIMITER $$
CREATE PROCEDURE process_payment(IN input_booking_id INT,
                                IN input_user_id INT,
                                IN input_amount NUMERIC(10,2),
                                IN input_payment_method VARCHAR(50))
BEGIN
    DECLARE pagado_total NUMERIC(10,2);
    DECLARE estado_reserva VARCHAR(50);
    DECLARE precio_total_reserva NUMERIC(10,2);

    SELECT status INTO estado_reserva
    FROM bookings
    WHERE bookings.id = input_booking_id;
    
    SELECT total_price INTO precio_total_reserva
    FROM bookings
    WHERE bookings.id = input_booking_id;

    IF (estado_reserva = 'pending') THEN
        INSERT INTO payments VALUES (NULL, input_booking_id, input_user_id, input_amount, input_payment_method, NOW(), 'completed');
        -- NOW() obtiene la fecha y hora actual

        SELECT sum(amount) INTO pagado_total 
        FROM payments
        WHERE booking_id = input_booking_id AND status = 'completed';

        IF (pagado_total >= precio_total_reserva) THEN
            UPDATE bookings SET status = 'confirmed' WHERE bookings.id = input_booking_id;
        END IF;
    END IF;
END $$
DELIMITER ;
