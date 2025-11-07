// EJERCICIO 1
// Buscar los documentos donde el alumno tiene:
// i) un puntaje mayor o igual a 80 en "exam" o bien un puntaje mayor o igual a 90 en "quiz" y
// ii) un puntaje mayor o igual a 60 en todos los "homework" (en otras palabras no tiene un puntaje menor a 60 en algún "homework")
// Las dos condiciones se tienen que cumplir juntas (es un AND)

db.grades.find(
    {
        $and: [
            {
                $or: [
                    { "scores.exam": { $gte: 80 } },
                    { "scores.quiz": { $gte: 90 } }
                ]
            },
            {
                "scores": {
                    $not: {
                        "$elemMatch": { "type": "homework", "score": { $lt: 60 } }
                    }
                }
            }
        ]
    },
    {
        "_id": 0, "student_id": -1, "class_id": 1, "scores": 1
    }
)

// EJERCICIO 2
// Calcular el puntaje mínimo, promedio, y máximo que obtuvo el alumno en las clases 20, 220, 420. El resultado debe mostrar además el id de la clase y el id del alumno, ordenados por alumno y clase en orden ascendentes.

db.grades.aggregate([
    {
        $match: {
            class_id: { $in: [20, 220, 420] }
        }
    },
    { $unwind: "$scores" },
    {
        $group: {
            _id: "$student_id",
            class_id: { $first: "$class_id" },
            min: { $min: "$scores.score" },
            avg: { $avg: "$scores.score" },
            max: { $max: "$scores.score" }
        }
    },
    {
        $sort: {
            _id: 1,
            class_id: 1
        }
    },
    {
        $project: {
            _id: 0,
            student_id: "$_id",
            class_id: 1,
            min: 1,
            avg: 1,
            max: 1
        }
    }
])

// EJERCICIO 3
// Para cada clase listar el puntaje máximo de las evaluaciones de tipo "exam" y el puntaje máximo de las evaluaciones de tipo "quiz". Listar en orden ascendente por el id de la clase. HINT: El operador $filter puede ser de utilidad.

db.grades.aggregate([
    {
        $match: {
            class_id: { $exists: true }
        }
    },
    {
        $group: {
            _id: "$class_id",

            // 1. Usa $max como operador de acumulación principal.
            // 2. Anida $max con $map para extraer el campo 'score' del array filtrado.
            // 3. Anida $filter para obtener solo los scores de tipo "exam".
            max_exam: {
                $max: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$scores",
                                as: "score_item",
                                cond: { $eq: ["$$score_item.type", "exam"] } // Condición SÓLO para filtrar por tipo
                            }
                        },
                        as: "exam_score",
                        in: "$$exam_score.score" // Extrae el valor numérico 'score'
                    }
                }
            },
            max_quiz: {
                $max: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$scores",
                                as: "score_item",
                                cond: { $eq: ["$$score_item.type", "quiz"] } // Condición SÓLO para filtrar por tipo
                            }
                        },
                        as: "quiz_score",
                        in: "$$quiz_score.score" // Extrae el valor numérico 'score'
                    }
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            class_id: "$_id",
            max_exam: 1,
            max_quiz: 1
        }
    },
    {
        $sort: {
            class_id: 1
        }
    }
])

// EJERCICIO 4
// Crear una vista "top10students" que liste los 10 estudiantes con los mejores promedios.

db.createView("top10students_homework", "grades", [
    { $unwind: "$scores" },
    {
        $group: {
            _id: "$student_id",
            average_student_score: { $avg: "$scores.score" }
        }
    },
    {
        $project: {
            _id: 0,
            student_id: "$_id",
            average_student_score: 1
        }
    },
    {
        $sort: {
            average_student_score: -1
        }
    },
    { $limit: 10 }
])

// EJERCICIO 5
/*
Actualizar los documentos de la clase 339, agregando dos nuevos campos: el
campo "score_avg" que almacena el puntaje promedio y el campo "letter" que tiene
el valor "NA" si el puntaje promedio está entre [0, 60), el valor "A" si el puntaje
promedio está entre [60, 80) y el valor "P" si el puntaje promedio está entre [80, 100].
*/

db.grades.updateMany(
    { class_id: 339 },
    [
        { $set: { score_avg: { $avg: "$scores.score" } } },
        {
            $set: {
                letter: {
                    $switch: {
                        branches: [
                            {
                                case: { $lt: ["$score_avg", 60] },
                                then: "NA"
                            },
                            {
                                case: { $lt: ["$score_avg", 80] },
                                then: "A"
                            },
                            {
                                case: { $lt: ["$score_avg", 100] },
                                then: "P"
                            }
                        ]
                    }
                }
            }
        }
    ])

// EJERCICIO 6
/*
(a) Especificar reglas de validación en la colección grades para todos sus campos y
subdocumentos anidados. Inferir los tipos y otras restricciones que considere
adecuados para especificar las reglas a partir de los documentos de la colección.

(b) Testear la regla de validación generando dos casos de fallas en la regla de
validación y un caso de éxito en la regla de validación. Aclarar en la entrega cuales
son los casos y por qué fallan y cuales cumplen la regla de validación. Los casos no
deben ser triviales, es decir los ejemplos deben contener todos los campos..
*/

// a)
db.runCommand({
    collMod: "grades",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["student_id", "scores", "class_id"],
            properties: {
                student_id: { bsonType: "int" },
                scores: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["type", "score"],
                        properties: {
                            type: {
                                enum: ["exam", "quiz", "homework"]
                            },
                            score: { bsonType: "double" }
                        }
                    }
                },
                class_id: { bsonType: "int" }
            }

        }
    }
})

// b)

db.grades.insertOne({
    student_id: 1,
    scores: [
        { type: "exam", score: "14.00" },
        { type: "final", score: 75.3 },
        { type: "quiz", score: 75 }
    ],
    class_id: 39
})
