// Agregar las siguientes reglas de validación usando JSON Schema. Luego de cada especificación testear que efectivamente las reglas de validación funcionen, intentando insertar 5 documentos válidos y 5 inválidos (por distintos motivos).

// EJERCICIO 1
// Especificar en la colección users las siguientes reglas de validación: El campo name (requerido) debe ser un string con un máximo de 30 caracteres, email (requerido) debe ser un string que matchee con la expresión regular, password (requerido) debe ser un string con al menos 50 caracteres.
// "^(.*)@(.*)\\.(.{2,4})$"

db.runCommand({
    collMod: "users",
    validator: {
        $jsonSchema: {
            required: ["name", "email", "password"],
            properties: {
                name: { bsonType: "string", maxLength: 30 },
                email: { bsonType: "string", pattern: "^(.*)@(.*)\\.(.{2,4})$" },
                password: { bsonType: "string", minLength: 50 }
            }
        }
    }
})

// EJERCICIO 2
// Obtener metadata de la colección users que garantice que las reglas de validación fueron correctamente aplicadas.

db.getCollectionInfos({ name: "users" })

// EJERCICIO 3
// Especificar en la colección theaters las siguientes reglas de validación: El campo theaterId (requerido) debe ser un int y location (requerido) debe ser un object con:
// a) un campo address (requerido) que sea un object con campos street1, city, state y zipcode todos de tipo string y requeridos
// b) un campo geo (no requerido) que sea un object con un campo type, con valores posibles “Point” o null y coordinates que debe ser una lista de 2 doubles

// estas reglas de validación no deben prohibir la inserción o actualización de documentos que no las cumplan sino que solamente deben advertir.

db.runCommand({
    collMod: "theaters",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["theaterId", "location"],
            properties: {
                theaterId: { bsonType: "int" },
                location: {
                    bsonType: "object",
                    required: ["address"],
                    properties: {
                        address: {
                            bsonType: "object",
                            required: ["street1", "city", "state", "zipcode"],
                            properties: {
                                street1: { bsonType: "string" },
                                city: { bsonType: "string" },
                                state: { bsonType: "string" },
                                zipcode: { bsonType: "string" },
                            }
                        },
                        geo: {
                            bsonType: "object",
                            required: ["type", "coordinates"],
                            properties: {
                                type: {
                                    enum: ["Point", null]
                                },
                                coordinates: {
                                    bsonType: "array",
                                    items: { bsonType: "double" },
                                    minItems: 2,
                                    maxItems: 2
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    validationAction: "warn"
})


// EJERCICIO 4
// Especificar en la colección movies las siguientes reglas de validación: El campo title (requerido) es de tipo string, year (requerido) int con mínimo en 1900 y máximo en 3000, y que tanto cast, directors, countries, como genres sean arrays de strings sin duplicados.
// Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora de insertar documentos. Recordar que mongo shell es un intérprete javascript y en javascript los literales numéricos son de tipo Number (double).

db.runCommand({
    collMod: "movies",
    validator: {
        $jsonSchema: {
            required: ["title", "year"],
            properties: {
                title: { bsonType: "string" },
                year: {
                    bsonType: "int",
                    minimum: 1900,
                    maximum: 3000
                },
                cast: {
                    bsonType: "array",
                    uniqueItems: true,
                    items: { bsonType: "string" }
                },
                directors: {
                    bsonType: "array",
                    uniqueItems: true,
                    items: { bsonType: "string" }
                },
                countries: {
                    bsonType: "array",
                    uniqueItems: true,
                    items: { bsonType: "string" }
                },
                genres: {
                    bsonType: "array",
                    uniqueItems: true,
                    items: { bsonType: "string" }
                }
            }
        }
    }
})


// EJERCICIO 5
// Crear una colección userProfiles con las siguientes reglas de validación: Tenga un campo user_id (requerido) de tipo “objectId”, un campo language (requerido) con alguno de los siguientes valores [ “English”, “Spanish”, “Portuguese” ] y un campo favorite_genres (no requerido) que sea un array de strings sin duplicados.


db.createCollection("userProfiles", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "language"],
            properties: {
                user_id: { bsonType: "objectId" },
                language: {
                    enum: ["English", "Spanish", "Portuguese"]
                },
                favorite_genres: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    uniqueItems: true
                }
            }
        }
    }
})


// EJERCICIO 6
// Identificar los distintos tipos de relaciones (One-To-One, One-To-Many) en las colecciones movies y comments. Determinar si se usó documentos anidados o referencias en cada relación y justificar la razón.

/*
En comments existe la referencia "movie_id" hacia movie
=> relacion  movie  1 -- *  comments

Esta decision se debe a la baja prioridad que se tiene de los comentarios con respecto a las peliculas
Es mas importante mantener cierta estabilidad en los documentos de las peliculas, por lo que incluir los campos
anidados de los comentarios puede afectar el rendimiento a la hora de acceder a cada pelicula
*/


// EJERCICIO 7
// Dado el diagrama de la base de datos shop junto con las queries más importantes, realizar las siguientes queries
// Debe crear el modelo de datos en mongodb aplicando las estrategias “Modelo de datos anidados” y Referencias. El modelo de datos debe permitir responder las queries de manera eficiente.
// Inserte algunos documentos para las colecciones del modelo de datos. Opcionalmente puede especificar una regla de validación de esquemas para las colecciones.

// a) Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular 
// b) Cantidad de libros por categorías
// c) Listar el nombre y dirección entrega y el monto total (quantity * price) de sus pedidos para un order_id dado


db.createCollection("orders", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["order_id", "delivery_name", "delivery_address", "cc_name", "cc_address", "cc_expiry"],
            properties: {
                order_id: { bsonType: "long" },
                delivery_name: { bsonType: "string", maxLength: 70 },
                delivery_address: { bsonType: "string", maxLength: 70 },
                cc_name: { bsonType: "string", maxLength: 32 },
                cc_expiry: { bsonType: "string", maxLength: 20 }
            }
        }
    }
})


db.createCollection("books", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["book_id", "title", "author", "price"],
            properties: {
                book_id: { bsonType: "int" },
                title: { bsonType: "string", maxLength: 70 },
                author: { bsonType: "string", maxLength: 70 },
                categories: {
                    bsonType: "array",
                    items: {
                        bsonType: "string",
                        maxLength: 70
                    },
                },
                price: { bsonType: "double" }
            }
        }
    }
})


db.createCollection("order_details", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["book_id", "order_id", "quantity", "price"],
            properties: {
                book_id: { bsonType: "int" },
                order_id: { bsonType: "long" },
                quantity: { bsonType: "int" },
                price: { bsonType: "double" }
            }
        }
    }
})

// no necesario para este caso de uso particular
/*
db.shop.createCollection("categories", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["category_id", "category_name"],
            properties: {
                category_id: { bsonType: "int" },
                category_name: { bsonType: "string", maxLength: 70 }
            }
        }
    }
})
*/


db.books.insertMany([
    {
        "book_id": 1,
        "title": "Cien años de soledad",
        "author": "Gabriel García Márquez",
        "categories": ["Ficción", "Realismo Mágico", "Novela"],
        "price": 15.99
    },
    {
        "book_id": 2,
        "title": "1984",
        "author": "George Orwell",
        "categories": ["Distopía", "Ciencia Ficción"],
        "price": 12.50
    },
    {
        "book_id": 3,
        "title": "El Gran Gatsby",
        "author": "F. Scott Fitzgerald",
        "price": 9.99
        /* El campo "categories" es opcional y se omite aquí. */
    },
    {
        "book_id": 4,
        "title": "Sapiens: De animales a dioses",
        "author": "Yuval Noah Harari",
        "categories": ["No Ficción", "Historia", "Filosofía"],
        "price": 25.75
    },
    {
        "book_id": 5,
        "title": "El Principito",
        "author": "Antoine de Saint-Exupéry",
        "categories": ["Infantil", "Ficción"],
        "price": 7.99
    }
])

db.orders.insertMany([
    {
        "order_id": NumberLong(1000000001),
        "delivery_name": "Ana García López",
        "delivery_address": "Calle Falsa 123, Madrid, 28001",
        "cc_name": "ANA G L",
        "cc_address": "Calle Falsa 123, Madrid, 28001",
        "cc_expiry": "12/28"
    },
    {
        "order_id": NumberLong(1000000002),
        "delivery_name": "Javier Ruiz Sanz",
        "delivery_address": "Av. Diagonal 456, Barcelona, 08008",
        "cc_name": "JAVIER R SANZ",
        "cc_address": "Av. Diagonal 456, Barcelona, 08008",
        "cc_expiry": "05/26"
    }
])


db.order_details.insertMany([
    {
        "book_id": 1,
        "order_id": NumberLong(1000000001),
        "quantity": 1,
        "price": 15.99
    },
    {
        "book_id": 4,
        "order_id": NumberLong(1000000001),
        "quantity": 2,
        "price": 25.75
    }
])


db.books.find(
    { author: "George Orwell" },
    { _id: 1, title: 1, categories: 1, price: 1 }
)

db.books.aggregate([
    { $unwind: "$categories" },
    {
        $group: {
            _id: "$categories",
            total: { $count: {} }
        }
    },
    {
        $project: {
            _id: 0,
            category: "$_id",
            total: 1
        }
    }
])

db.orders.aggregate([
    {
        $lookup: {
            from: "order_details",
            localField: "order_id",
            foreignField: "order_id",
            as: "details"
        }
    },
    { $unwind: "$details" },
    {
        $group: {
            _id: "$order_id",
            delivery_name: { $first: "$delivery_name" },
            delivery_address: { $first: "$delivery_address" },
            cost: {
                $sum: {
                    $multiply: ["$details.quantity", "$details.price"]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            order_id: "$_id",
            delivery_name: 1,
            delivery_address: 1,
            cost: 1
        }
    }
])

// EJERCICIO 8
// Dado el diagrama que representa los datos de un blog de artículos, se pide
// a) Crear 3 modelos de datos distintos en mongodb aplicando solo las estrategias “Modelo de datos anidados” y Referencias (es decir, sin considerar queries). 

// Crear un modelo de datos en mongodb aplicando las estrategias “Modelo de datos anidados” y Referencias y considerando las siguientes queries.
// 1) Listar título y url, tags y categorías de los artículos dado un user_id
// 2) Listar título, url y comentarios que se realizaron en un rango de fechas.
// 3) Listar nombre y email dado un id de usuario
// Inserte algunos documentos para las colecciones del modelo de datos. Opcionalmente puede especificar una regla de validación de esquemas  para las colecciones.


db.createCollection("Articles", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "title", "date", "text", "url"],
            properties: {
                user_id: { bsonType: "objectId" },
                title: { bsonType: "string" },
                date: { bsonType: "date" },
                text: { bsonType: "string" },
                url: { bsonType: "string" },
                categories: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    }
                },
                tags: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    }
                }
            }
        }
    }
})

db.createCollection("Users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email"],
            properties: {
                name: { bsonType: "string" },
                email: { bsonType: "string" }
            }
        }
    }
})

db.createCollection("Comments", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "article_id", "date", "text"],
            properties: {
                user_id: { bsonType: "objectId" },
                article_id: { bsonType: "objectId" },
                date: { bsonType: "date" },
                text: { bsonType: "string" }
            }
        }
    }
})



db.Users.insertMany([
    {
        name: "Ana García",
        email: "ana.garcia@example.com"
    },
    {
        name: "Carlos Ruiz",
        email: "carlos.ruiz@example.com"
    },
    {
        name: "Elena Pérez",
        email: "elena.perez@example.com"
    }
])

db.Articles.insertMany([
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f51'), // Corresponde a 'Ana García' (simulado)
        title: "Introducción a MongoDB: Base de Datos NoSQL",
        date: new ISODate("2025-10-15T10:00:00Z"),
        text: "MongoDB es un sistema de base de datos de código abierto orientado a documentos...",
        url: "http://example.com/articulos/mongodb-intro",
        categories: ["Tecnología", "Bases de Datos"],
        tags: ["mongodb", "nosql", "tutorial"]
    },
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f52'), // Corresponde a 'Carlos Ruiz' (simulado)
        title: "El Impacto de la Inteligencia Artificial en el Diseño Web",
        date: new ISODate("2025-10-20T14:30:00Z"),
        text: "La IA está revolucionando la forma en que interactuamos con las páginas web...",
        url: "http://example.com/articulos/ia-diseno-web",
        categories: ["Inteligencia Artificial", "Diseño"],
        tags: ["ia", "web", "futuro"]
    },
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f53'), // Corresponde a 'Elena Pérez' (simulado)
        title: "Receta Rápida: Tacos de Pescado al Pastor",
        date: new ISODate("2025-10-28T09:15:00Z"),
        text: "Una deliciosa y sencilla receta para una cena rápida...",
        url: "http://example.com/articulos/receta-tacos",
        categories: ["Gastronomía"],
        tags: ["recetas", "comida", "mexicana"]
    }
])


db.Comments.insertMany([
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f52'), // Carlos Ruiz
        article_id: ObjectId('6903d059d7e3ae4ba9ce5f54'), // Artículo de MongoDB
        date: new ISODate("2025-10-16T11:20:00Z"),
        text: "¡Excelente introducción! ¿Podrías hablar más sobre las agregaciones?"
    },
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f53'), // Elena Pérez
        article_id: ObjectId('6903d059d7e3ae4ba9ce5f54'), // Artículo de MongoDB
        date: new ISODate("2025-10-16T15:05:00Z"),
        text: "Muy útil para principiantes. Gracias."
    },
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f51'), // Ana García
        article_id: ObjectId('6903d059d7e3ae4ba9ce5f56'), // Artículo de Tacos
        date: new ISODate("2025-10-29T10:00:00Z"),
        text: "¡Hice la receta y fue un éxito! Delicioso y fácil."
    },
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f52'), // Carlos Ruiz
        article_id: ObjectId('6903d059d7e3ae4ba9ce5f55'), // Artículo de Tacos
        date: new ISODate("2023-05-29T10:00:00Z"),
        text: "¡Hice la receta y fue un éxito! Delicioso y fácil."
    },
    {
        user_id: ObjectId('6903d016d7e3ae4ba9ce5f52'), // Carlos Ruiz
        article_id: ObjectId('6903d059d7e3ae4ba9ce5f55'), // Artículo de Tacos
        date: new ISODate("2024-09-29T10:00:00Z"),
        text: "Siempre vuelvo a este articulo porque me olvido"
    }

])


// 1) Listar título y url, tags y categorías de los artículos dado un user_id

db.Articles.find(
    { "user_id": { $eq: ObjectId('6903d016d7e3ae4ba9ce5f51') } },
    { _id: 0, title: 1, url: 1, tags: 1, categories: 1 }
)

// 2) Listar título, url y comentarios que se realizaron en un rango de fechas.

db.Comments.aggregate(
    {
        $match: {
            $expr: {
                $and: [
                    { $gte: [{ $year: "$date" }, 2022] },
                    { $lte: [{ $year: "$date" }, 2024] }
                ]
            }
        }
    },
    {
        $group: {
            _id: "$article_id",
            comments: {
                $push: {
                    user_id: "$user_id",
                    date: "$date",
                    text: "$text"
                }
            }
        }
    },
    {
        $lookup: {
            from: "Articles",
            localField: "_id",
            foreignField: "_id",
            as: "article_details"
        }
    },
    { $unwind: "$article_details" },
    {
        $project: {
            _id: 0,
            title: "$article_details.title",
            url: "$article_details.url",
            comments_count: { $size: "$comments" },
            comments: "$comments"
        }
    }
)

// 3) Listar nombre y email dado un id de usuario

db.Users.find(
    { "_id": ObjectId('6903d016d7e3ae4ba9ce5f51') },
    { _id: 0, name: 1, email: 1 }
)
