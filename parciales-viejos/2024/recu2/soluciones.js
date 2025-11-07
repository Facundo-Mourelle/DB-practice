// EJERCICIO 1
/*
Escribir una consulta para calcular el promedio de puntuaciones de cada clase
(class_id) y compararlo con el promedio general de todas las clases. La consulta
debe devolver un documento para cada clase que incluya el class_id, el promedio de
puntuaciones de esa clase y un campo adicional que indique si el promedio de la
clase está por encima o por debajo del promedio general de todas las clases. Los
resultados deben ordenarse de manera ascendente por class_id y de manera
descendente por average_score.

/*
Estructura de un documento de grades:
{
  _id: ObjectId('56d5f7eb604eb380b0d8d8ce'),
  student_id: 0,
  scores: [
    { type: 'exam', score: 78.40446309504266 },
    { type: 'quiz', score: 73.36224783231339 },
    { type: 'homework', score: 46.980982486720535 },
    { type: 'homework', score: 76.67556138656222 }
  ],
  class_id: 339
}

Queremos:
- separar todos los scores (unwind)
- agrupar por clase (group)
- calcular el promedio de la clase (lo hacemos directamente sobre el group)
- calcular el promedio de todas las clases (lookup adicional (y guardamos en un unico documento con _id: null))
- crear campos con comparacion de cada promedio con el general (addField)
- proyectar la informacion (proyect)

Estructura output:
{
"class_id": <class_id>,
"average_score": <average_score>, // puntuación promedio de esta clase
"comparison_to_overall_average": "above" | "below" | "equal" // comparación con el
promedio general de todas las clases
}



Alternativa:
- separar los scores
- calcular promedio de clase
- ir calculando el promedio general
- crear campos de comparacion
- proyectar datos

*/

db.grades.aggregate([

    { $match: { "class_id": { $exists: true } } },
    { $unwind: "$scores" },
    {
        $group: {
            _id: "$class_id",
            average_score: { $avg: "$scores.score" }
        }
    },
    {
        $lookup: {
            from: "grades",
            pipeline: [
                { $unwind: "$scores" },
                {
                    $group: {
                        _id: null,
                        score: { $avg: "$scores.score" }
                    }
                }
            ],
            as: "overall_average"
        }
    },
    { $unwind: "$overall_average" },
    {
        $addFields: {
            comparison_to_overall_average: {
                $switch: {
                    branches: [
                        {
                            case: { $gt: ["$average_score", "$overall_average.score"] },
                            then: "above"
                        },
                        {
                            case: { $lt: ["$average_score", "$overall_average.score"] },
                            then: "below"
                        },
                        {
                            case: { $eq: ["$average_score", "$overall_average.score"] },
                            then: "equal"
                        },
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            class_id: "$_id",
            average_score: "$average_score",
            overall_average_score: "$overall_average.score",
            comparison_to_overall_average: "$comparison_to_overall_average"
        }
    },
    {
        $sort: {
            class_id: 1,
            average_score: -1
        }
    }
])


// FORMA ALTERNATIVA

db.grades.aggregate([
    { $match: { "class_id": { $exists: true } } },
    { $unwind: "$scores" },
    {
        $group: {
            _id: "$class_id",
            average_score: { $avg: "$scores.score" }
        }
    },
    {
        $group: {
            _id: null, // Agrupa TODOS los documentos en un solo grupo
            class_averages: {
                // Guarda los promedios por clase en un array
                $push: {
                    _id: "$_id",
                    average_score: "$average_score"
                }
            },
            overall_average_score: { $avg: "$average_score" }
        }
    },
    { $unwind: "$class_averages" },
    {
        $project: {
            _id: "$class_averages._id",
            average_score: "$class_averages.average_score",
            overall_average_score: "$overall_average_score"
        }
    },
    {
        $addFields: {
            comparison_to_overall_average: {
                $switch: {
                    branches: [
                        { case: { $gt: ["$average_score", "$overall_average_score"] }, then: "above" },
                        { case: { $lt: ["$average_score", "$overall_average_score"] }, then: "below" }
                    ],
                    default: "equal"
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            class_id: "$_id",
            average_score: 1,
            overall_average_score: 1,
            comparison_to_overall_average: 1
        }
    },
    {
        $sort: {
            class_id: 1,
            average_score: -1
        }
    }
]);

// EJERCICIO 2

// Actualizar los documentos en la colección grades, ajustando todas las puntuaciones para que estén normalizadas entre 0 y 7
// Valor normalizado = [(valor) / 100 ] * 7
// HINT: usar updateMany con map

db.grades.updateMany(
    {},
    [{
        $set: {
            scores: {
                $map: {
                    input: "$scores",
                    as: "each_score",
                    in: {
                        $mergeObjects: [
                            "$$each_score",
                            {
                                score: {
                                    $multiply: [
                                        { $multiply: ["$$each_score.score", 0.01] }, 7]
                                }
                            }]
                    }
                }
            }
        }
    }]
)

// EJERCICIO 3
// Crear una vista "top10students_homework" que liste los 10 estudiantes con los mejores promedios para homework. Ordenar por average_homework_score descendiente.

db.createView("top10students_homework", "grades", [
    { $unwind: "$scores" },
    {
        $group: {
            _id: "$student_id",
            average_homework_score: { $avg: "$scores.score" }
        }
    },
    {
        $project: {
            _id: 0,
            student_id: "$_id",
            average_homework_score: 1
        }
    },
    {
        $sort: {
            average_homework_score: -1
        }
    },
    { $limit: 10 }
])

// EJERCICIO 4
// Especificar reglas de validación en la colección grades. El único requerimiento es que se valide que los type de los scores sólo puedan ser de estos tres tipos: [“exam”, “quiz”, “homework”]

db.runCommand({
    collMod: "grades",
    validator: {
        $jsonSchema: {
            required: ["scores"],
            properties: {
                scores: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["type"],
                        properties: {
                            type: {
                                enum: ["exam", "quiz", "homework"]
                            }
                        }
                    }
                },
            }
        }
    },
    validationAction: "error"
})
