/*
-- TODO: Proposito principal

-- NOTE: Procedimientos almacenados

Los procedimientos almacenados se utilizan principalmente para realizar operaciones en una base de datos, como insertar, actualizar o eliminar registros, así como para realizar tareas lógicas o de flujo de control dentro de la base de datos. Los procedimientos almacenados pueden realizar cambios en los datos de la base de datos y también pueden devolver valores mediante parámetros de salida.

-- NOTE: Funciones

Las funciones se utilizan principalmente para realizar cálculos o transformaciones en los datos y devolver un valor escalable (escalar) basado en los parámetros de entrada. No pueden realizar modificaciones en la base de datos, como insertar o actualizar registros.

-- TODO: Retorno del valor

-- NOTE: Procedimientos almacenados

Los procedimientos almacenados pueden tener parámetros
de salida para devolver valores, pero no necesariamente devuelven un valor. Pueden realizar
cambios en la base de datos y no están diseñados específicamente para devolver un
resultado único.

-- NOTE: Funciones

Las funciones están diseñadas específicamente para devolver un valor, ya sea
un valor escalar (como un número o una cadena) o una tabla (en el caso de funciones de
tabla). No pueden realizar modificaciones en la base de datos.


-- TODO: Uso en consultas

-- NOTE: Procedimientos almacenados

Los procedimientos almacenados se llaman utilizando la
instrucción EXEC o CALL y se utilizan en las consultas como si fueran comandos SQL
independientes.

-- NOTE: Funciones

Las funciones se utilizan en las consultas como expresiones, y su valor devuelto
se puede usar directamente en una consulta SELECT u otras partes de una consulta SQL.

-- WARNING: Trigger

Un disparador o trigger es una funcionalidad que la base de datos ejecuta de
forma automática cuando se realiza una operación de tipo INSERT,
UPDATE, o DELETE que impacta sobre los registros en la tabla asociada.

Se puede configurar un trigger para que se active o bien antes (BEFORE) o
después (AFTER) del evento del trigger

*/

-- Ejemplo trigger

CREATE TRIGGER trigger_name trigger_time trigger_event
ON table_name FOR EACH ROW
BEGIN
    [trigger_order]
    trigger_body
END;
    trigger_time: {BEFORE | AFTER}
    trigger_event: {INSERT | UPDATE | DELETE}
    trigger_order: {FOLLOWS| PRECEDES} other_trigger_name


-- WARNING: Views

/*
Las relaciones de vista se pueden definir como relaciones que contienen el
resultado de consultas.
Las vistas son útiles para ocultar información innecesaria y para recopilar
información de más de una relación en una sola vista.
Cuando se define una vista, normalmente la base de datos almacena solo la
consulta que define la vista.
*/

CREATE VIEW view_name AS query_expression;

CREATE VIEW facultad AS
SELECT ID, name, dept_name
from instructor;

-- NOTE: Vista Materializada

/*
Cuando se define una vista, normalmente la base de datos almacena sólo la
consulta que define la vista.
Por el contrario, una vista materializada es una vista cuyos contenidos se
calculan y almacenan.
*/

CREATE MATERIALIZED VIEW view_name AS query_expression;

/*
Las vistas materializadas constituyen datos redundantes

Sin embargo, en muchos casos es mucho más barato leer el contenido de
una vista materializada que calcular el contenido de la vista ejecutando la
consulta que define la vista.

Son importantes para el mejorar el rendimiento
*/






