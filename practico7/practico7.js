use('mflix')

// EJERCICIO 1
// Insertar 5 nuevos usuarios en la colección users. Para cada nuevo usuario creado, insertar al menos un comentario realizado por el usuario en la colección comments.
db.users.insertMany(
    [
        {
            name: 'pibe x1',
            email: 'pibex1@randomail.com',
            password: '$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu'
        },
        {
            name: 'pibe x2',
            email: 'pibex2@randomail.com',
            password: '$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu'
        },
        {
            name: 'pibe x3',
            email: 'pibex3@randomail.com',
            password: '$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu'
        },
        {
            name: 'pibe x4',
            email: 'pibex4@randomail.com',
            password: '$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu'
        },
        {
            name: 'pibe x5',
            email: 'pibex5@randomail.com',
            password: '$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu'
        }
    ]
)

db.comments.insertMany(
    [
        {
            name: 'pibe x1',
            email: 'pibex1@randomail.com',
            movie_id: ObjectId('573a1390f29313caabcd418c'),
            text: 'malardo la verdad'
        },
        {
            name: 'pibe x2',
            email: 'pibex2@randomail.com',
            movie_id: ObjectId('573a1390f29313caabcd418c'),
            text: 'malardo la verdad'
        },
        {
            name: 'pibe x3',
            email: 'pibex3@randomail.com',
            movie_id: ObjectId('573a1390f29313caabcd418c'),
            text: 'malardo la verdad'
        },
        {
            name: 'pibe x4',
            email: 'pibex4@randomail.com',
            movie_id: ObjectId('573a1390f29313caabcd418c'),
            text: 'malardo la verdad'
        },
        {
            name: 'pibe x5',
            email: 'pibex5@randomail.com',
            movie_id: ObjectId('573a1390f29313caabcd418c'),
            text: 'malardo la verdad'
        }
    ]
)
// ======================================================
// EJERCICIO 2
// Listar el título, año, actores (cast), directores y rating de las 10 películas con mayor rating (“imdb.rating”) de la década del 90. ¿Cuál es el valor del rating de la película que tiene mayor rating? (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).

db.movies.find(
    {
    $and: [
        {"year": {$gte: 1990}},
        {"year": {$lt: 2000}},
        {"imdb.rating": {$type: "double"}}
        ]
    },
    {
        _id: 0, title: 1, cast: 1, directors: 1, "imdb.rating": 1
    }
).sort({"imdb.rating": -1}
).limit(10)

// ======================================================
// EJERCICIO 3
// Listar el nombre, email, texto y fecha de los comentarios que la película con id (movie_id) ObjectId("573a1399f29313caabcee886") recibió entre los años 2014 y 2016 inclusive. Listar ordenados por fecha. 

db.comments.find(
    {
        "movie_id": {$eq: ObjectId("573a1399f29313caabcee886")},
        "date": {$gte: ISODate('2014-01-01'), $lt: ISODate('2017-01-01')}
    },
    {
        name: 1, email: 1, text: 1, date: 1
    }
).sort({"date": 1})

// Escribir una nueva consulta (modificando la anterior) para responder ¿Cuántos comentarios recibió?

db.comments.find(
    {
        "movie_id": {$eq: ObjectId("573a1399f29313caabcee886")},
        "date": {$gte: ISODate('2014-01-01'), $lt: ISODate('2017-01-01')}
    },
    {
        _id: 0, movie_id: 0
    }
).count()

// ======================================================
// EJERCICIO 4
// Listar el nombre, id de la película, texto y fecha de los 3 comentarios más recientes realizados por el usuario con email patricia_good@fakegmail.com

db.comments.find(
    {
        "email": {$eq: "patricia_good@fakegmail.com"},
    },
    {
        _id: 0, name: 1, movie_id: 1, text: 1, date: 1
    }
).sort({"date": -1}
).limit(3)


// ======================================================
// EJERCICIO 5
// Listar el título, idiomas (languages), géneros, fecha de lanzamiento (released) y número de votos (“imdb.votes”) de las películas de géneros Drama y Action (la película puede tener otros géneros adicionales), que solo están disponibles en un único idioma y por último tengan un rating (“imdb.rating”) mayor a 9 o bien tengan una duración (runtime) de al menos 180 minutos. Listar ordenados por fecha de lanzamiento y número de votos

db.movies.find(
    {
        genres: {$all: ["Drama", "Action"]},
        languages: {$size: 1},
        $or: [
            {"imdb.rating": {$type: "double", $gt: 9}},
            {"runtime": {$gte: 180}}
        ],
    },
    {
        title: 1, languages: 1, genres: 1, released: 1, "imdb.votes": 1
    }
).sort(
        {"released": -1},
        {"imdb.votes": -1},
        {_id: 1}
    )

// ======================================================
// EJERCICIO 6
// Listar el id del teatro (theaterId), estado (“location.address.state”), ciudad (“location.address.city”), y coordenadas (“location.geo.coordinates”) de los teatros que se encuentran en algunos de los estados "CA", "NY", "TX" y el nombre de la ciudades comienza con una ‘F’. Listar ordenados por estado y ciudad.




// ======================================================
// EJERCICIO 7
// Actualizar los valores de los campos texto (text) y fecha (date) del comentario cuyo id es ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario" y fecha actual respectivamente.




// ======================================================
// EJERCICIO 8
// Actualizar el valor de la contraseña del usuario cuyo email es joel.macdonel@fakegmail.com a "some password". La misma consulta debe poder insertar un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos veces. ¿Qué operación se realiza en cada caso?  (Hint: usar upserts). 




// ======================================================
// EJERCICIO 9
// Remover todos los comentarios realizados por el usuario cuyo email es victor_patel@fakegmail.com durante el año 1980.




// ======================================================
// ================    PARTE 2    =======================
// ======================================================
// EJERCICIO 10
// Listar el id del restaurante (restaurant_id) y las calificaciones de los restaurantes donde al menos una de sus calificaciones haya sido realizada entre 2014 y 2015 inclusive, y que tenga una puntuación (score) mayor a 70 y menor o igual a 90.
//


// ======================================================
// EJERCICIO 11
// Agregar dos nuevas calificaciones al restaurante cuyo id es "50018608". A continuación se especifican las calificaciones a agregar en una sola consulta.
/*
{
	"date" : ISODate("2019-10-10T00:00:00Z"),
	"grade" : "A",
	"score" : 18
}
{
	"date" : ISODate("2020-02-25T00:00:00Z"),
	"grade" : "A",
	"score" : 21
}
 */
