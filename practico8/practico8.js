// Usando mflix y restaurantdb
// realizar las siguientes consultas usando el pipeline de agregación

// EJERCICIO 1
// Cantidad de cines (theaters) por estado

db.theaters.aggregate([
    {$group: {
        _id: "$location.address.state",
        total: {$count: {}}
        }
    }
])

// EJERCICIO 2
// Cantidad de estados con al menos dos cines (theaters) registrados

db.theaters.aggregate([
    {$group: {
        _id: "$location.address.state",
        total: {$count: {}}
        }
    },
    {$match: {
        "total": {$gte: 2}
        }
    },
    {
        $group: {
            _id: null,
            states_with_more_than_2_theaters: {$count: {}}
        }
    }
])

// EJERCICIO 3
// Cantidad de películas dirigidas por "Louis Lumière". Se puede responder sin pipeline de agregación, realizar ambas queries.

db.movies.aggregate([
    {$unwind: "$directors"},
    {$group: {
        _id: "$directors",
        total: {$count: {}}
        }
    },
    {$match: {
            _id: "Louis Lumière"
        }
    }
])

// sin agregacion

db.movies.find(
    {directors: {
        $elemMatch: {
            $eq: "Louis Lumière"
            }
        }
    },
    {_id: 1}
).count()

// EJERCICIO 4
// Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959). Se puede responder sin pipeline de agregación, realizar ambas queries.

db.movies.aggregate([
    {
        $match: {
            year: {$gte: 1950, $lte: 1959}
        }
    },
    {
        $group: {
            _id: null,
            total: {$count: {}}
        }
    },
    {
        // para ocultar el print de _id que queda feo
        $project: {
            _id: 0
        }
    }
])

db.movies.find(
    {$and: [
        {"year": {$gte: 1950}},
        {"year": {$lte: 1959}},
        ]
    },
    {_id: 0}
).count()


// EJERCICIO 5
// Listar los 10 géneros con mayor cantidad de películas (tener en cuenta que las películas pueden tener más de un género). Devolver el género y la cantidad de películas. Hint: unwind puede ser de utilidad

db.movies.aggregate([
    {
        $unwind: "$genres"
    },
    {
        $group: {
            _id: "$genres",
            total: { $count: {}}
        }
    },
    {
        $project: {
            _id: 0,
            genre: "$_id"
        }
    },
    {
        $sort: {
            total: -1
        }
    },
    {
        $limit: 10
    }
])

// EJERCICIO 6
// Top 10 de usuarios con mayor cantidad de comentarios, mostrando Nombre, Email y Cantidad de Comentarios.

db.comments.aggregate([
    {
        $unwind: "$email"
    },
    {
        $group: {
            _id: "$email",
            total: {$count: {}}
        }

    },
    {
        $project: {
            _id: 0,
            user: "$_id",
            name: 1,
            total: 1
        }
    },
    {
        $sort: {
            total: -1
        }
    },
    {
        $limit: 10
    }

])

// EJERCICIO 7
// Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en los años 80 (desde 1980 hasta 1989), ordenados de mayor a menor por promedio del año.


db.movies.aggregate([
    {
        $match: {
            year: {$gte: 1980, $lt: 1990},
            "imdb.rating": {$type: "double"}
        }
    },
    {
        $group: {
            _id: "$year",
            year: {$first: "$year"},
            avg: {$avg: "$imdb.rating"},
            min: {$min: "$imdb.rating"},
            max: {$max: "$imdb.rating"},
        }
    },
    {
        $project: {
            _id: 0
        }
    },
    {
        $sort: {
            avg: -1
        }
    }
])

// EJERCICIO 8
// Título, año y cantidad de comentarios de las 10 películas con más comentarios.

db.comments.aggregate([
    {
        $group: {
            _id: "$movie_id",
            total: {$count: {}}
        }
    },
    {
        $sort: {
            total: -1
        }
    },
    {
        $limit: 10
    },
    {
        $lookup: {
            from: "movies",
            localField: "_id",
            foreignField: "_id",
            as: "movie"
        }
    },
    {
        $unwind: "$movie"
    },
    {
        $project: {
            title: "$movie.title",
            year: "$movie.year",
            total: 1,
            _id: 0
        }
    }
])

// EJERCICIO 9
// Crear una vista con los 5 géneros con mayor cantidad de comentarios, junto con la cantidad de comentarios.

db.createView("top_commented_genres", "movies", [
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "movie_id",
            as: "movie_comments"
        }
    },
    {
        $unwind: "$genres"
    },
    {
        $group: {
            _id: "$genres",
            total: {
                $sum: {
                    $size: "$movie_comments"
                }
            }
        }
    },
    {
        $sort: {
            total: -1
        }
    },
    {
        $limit: 5
    },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            total: 1
        }
    }
])


db.top_commented_genres.find()

// EJERCICIO 10
// Listar los actores (cast) que trabajaron en 2 o más películas dirigidas por "Jules Bass". Devolver el nombre de estos actores junto con la lista de películas (solo título y año) dirigidas por “Jules Bass” en las que trabajaron. 
// Hint1: addToSet
// Hint2: {'name.2': {$exists: true}} permite filtrar arrays con al menos 2 elementos, entender por qué.
// Hint3: Puede que tu solución no use Hint1 ni Hint2 e igualmente sea correcta

db.movies.aggregate([
    {
        $match: {
            directors: {
                $elemMatch: {
                    $eq: "Jules Bass"
                }
            }
        }
    },
    {
        $unwind: "$cast"
    },
    {
        $group: {
            _id: "$cast",
            movies: {
                $addToSet: {
                    title: "$title",
                    year: "$year"
                }
            }
        }
    },
    {
        $match: {
            "movies.2": { $exists: true }
        }
    },
    {
        $project: {
            actor: "$_id",
            movies: 1,
            _id: 0
        }
    }
])


// Explicacion Hint 2: chequea si existe un segundo elemento en el arreglo movies. Filtra los actores con +2 peliculas
//                      dirigidas por Jules Bass

// EJERCICIO 11
// Listar los usuarios que realizaron comentarios durante el mismo mes de lanzamiento de la película comentada, mostrando Nombre, Email, fecha del comentario, título de la película, fecha de lanzamiento.
// HINT: usar $lookup con multiple condiciones

db.comments.aggregate([
    {
        $lookup: {
            from: "movies",
            localField: "movie_id",
            foreignField: "_id",
            as: "movie_info"
        }
    },
    {
        $unwind: "$movie_info"
    },
    {
        $match: {
            $expr: {
                $and: [
                    { $eq: [{ $month: "$date" }, { $month: "$movie_info.released" }] },
                    { $eq: [{ $year: "$date" }, { $year: "$movie_info.released" }] }
                ]
            }
        }
    },
    {
        $project: {
            _id: 0,
            user: "$name",
            email: "$email",
            movie_title: "$movie_info.title",
            date_of_comment: "$date",
            date_of_release: {
                $ifNull: ["$movie_info.released", "$movie_info.year"]}
        }
    }
])

// EJERCICIO 12
// Listar el id y nombre de los restaurantes junto con su puntuación máxima, mínima y la suma total. Se puede asumir que el restaurant_id es único.
// a) Resolver con $group y accumulators.

db.restaurants.aggregate([
    {
        $unwind: "$grades"
    },
    {
        $group: {
            _id: "$restaurant_id",
            name: {$first: "$name"},
            max: {$max: "$grades.score"},
            min: {$min: "$grades.score"},
            total: {$sum: "$grades.score"}
        }
    },
    {
        $project: {
            _id: 0,
            restaurant_id: "_id",
            name: "$name",
            max: 1,
            min: 1,
            total: 1
        }
    }
])

// b) Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.

db.restaurants.aggregate([
    {
        $project: {
            _id: 0,
            restaurant_id: "$_id",
            name: "$name",
            scores: {
                $map: {
                    input: "$grades",
                    as: "grade",
                    in: "$$grade.score"
                }
            }
        }
    },
    {
        $project: {
            restaurant_id: 1,
            name: 1,
            max: {$max: "$scores"},
            min: {$min: "$scores"},
            sum: {$sum: "$scores"}
            }
    }
])

// c) Resolver como en el punto b) pero usar $reduce para calcular la puntuación total.

db.restaurants.aggregate([
    {
        $project: {
            _id: 0,
            restaurant_id: "$_id",
            name: "$name",
            scores: {
                $map: {
                    input: "$grades",
                    as: "grade",
                    in: "$$grade.score"
                }
            }
        }
    },
    {
        $project: {
            restaurant_id: 1,
            name: 1,
            max: {$max: "$scores"},
            min: {$min: "$scores"},
            sum: {
                $reduce: {
                    input: "$scores",
                    initialValue: 0,
                    in: {$add: ["$$value", "$$this"]}
                }
            },
        }
    }
])

// d) Resolver con find

db.restaurants.find(
    {},
    {
        _id: 1,
        name: 1,
        grades: 1
    }
).forEach(function(restaurant) {
    // 1. Extraer el array de solo las puntuaciones numéricas (usando map de JS)
    let scores = restaurant.grades.map(grade => grade.score);

    // 2. Calcular la suma total (usando reduce de JS)
    let sum = scores.reduce((total, score) => total + score, 0);

    // 3. Calcular la puntuación máxima y mínima (usando Math.max/min de JS)
    // Se usa el operador spread (...) para pasar los elementos del array como argumentos
    let max = Math.max(...scores);
    let min = Math.min(...scores);
    
    // 4. Imprimir el resultado deseado
    printjson({
        Restaurant_ID: restaurant._id,
        Nombre: restaurant.name,
        Puntuacion_Maxima: max,
        Puntuacion_Minima: min,
        Suma_Total: sum
    });
});

// EJERCICIO 13
// Actualizar los datos de los restaurantes añadiendo dos campos nuevos.
// a) "average_score": con la puntuación promedio

db.restaurants.updateMany(
    {},
    [
        {
            $set: {
                "average_score": {
                    $avg: "$grades.score"
                }
            }
        }
    ]
)

db.restaurants.find(
    { "rating": { $exists: true } },
    { name: 1, grades: 1, average_score: 1, rating: 1}
).limit(5)

// b) "grade": (con 1 sola query)
/*
  con "A" si "average_score" está entre 0 y 13, 
  con "B" si "average_score" está entre 14 y 27 
  con "C" si "average_score" es mayor o igual a 28 
*/

db.restaurants.updateMany(
    {},
    [
        {
            $set: {
                "rating": {
                    $switch: {
                        branches: [
                            {
                                case: {$lte: ["$average_score", 13]},
                                then: "A"
                            },
                            {
                                case: {$lte: ["$average_score", 27]},
                                then: "B"

                            },
                        ],
                        default: "C"
                    }
                }
            }
        }
    ]
)

// HINT1. Se puede usar pipeline de agregación con la operación update
// HINT2. El operador $switch o $cond pueden ser de ayuda.
