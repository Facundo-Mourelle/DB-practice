db.createCollection(name, <options>);
db.<collection>.drop()

// CRUD operations

db.<collection>.insertOne( <document> )
db.<collection>.insertMany( [ <doc1>, … , <docN> ] )

db.<collection>.findOne( <query filter>, <projection> )
db.<collection>.find( <query filter>, <projection> )

// inclusion     exclusion
{<field>: 1}     {<field>: 0}

// OPERADORES
db.<collection>.find( 
    { <field>: { <operator>: <value> }, ... }
)

// operadores COMPARATIVOS
// $eq  $nq  $gt  $gte  $lt  $lte  $in  $nin

// operadores LOGICOS
// $$and $or $not $nor

// operadores en ARREGLOS
// $all: matchea si el campo arreglo contiene todos los elementos especificados en value
// $elemMatch: matchea si al menos un elemento en el campo arreglo cumple todas las condiciones especificadas
// $size: matchea si el campo arreglo es del largo especificado

db.survey.find( { 
    results: { 
        $elemMatch: { product: "xyz", score: { $gt: 7 } }
        } 
    }
)

// metodos del cursor

db.<collection>.find( 
        <query filter>,
		<projection>
).sort(
    // -1 orden descendente
    // 1 orden ascendente
    { <field1>: <1 or -1>, <field2>: <1 or -1> ... }
).skip(
    <offset>
).limit(
<number>
)

// matching
{field: null}
{field: {$type: <type>}}
{field: {$exists: <false>/<true>}}


// update-delete
db.<collection>.updateOne( <query filter>, <update>, <options> )
db.<collection>.updateMany( <query filter>, <update>, <options> )

db.<collection>.deleteOne( <query filter>)
db.<collection>.deleteMany( <query filter> )

updateOne(
    {item: ""},
    {
        $set: {field: <value>},
        $currentDate: {field: true},
            // tipo arreglo
            $addToSet: {field: {$operator: ["item1", "item2"]}}
            $push: {field: <value>},
            // permiten usar $each
            // en addToSet añade valores si no existe en el arreglo
            // en push hace append

    },
    {
        // Update + Insert
        upsert: true
    }
)


// ========================================================================
// Agregaciones

{operator: {arg}}
{$operator: [{arg1}, {arg2}, ...]}

// operadores / stages basicos
$match | $project | $skip $limit $sort | $count $addFields

$match {<query filter>}
$project {<specifications>}
    $project {
        field: <expr>
    }
$count {field}
$addFields {newfield: <aggr-expr>}


{
// stages complejos

// Deconstruye un campo arreglo en el documento y crea documentos separados para cada elemento en el arreglo
{$unwind: <field-path>}

// Reemplaza el documento por un documento anidado especificado
{$replaceRoot: {newRoot: <replacement>} }
//
// Agrupa los documentos por una expresión especificada y aplica las expresiones acumuladoras
{$group: {
    _id: <expr>,
    <field>: {<accumulator>: <expr>},
        // <accumulator> == $avg, $min, $max, etc
    ...
    }
}
// Realiza la unión de dos colecciones
{$unionWith: {coll: <collection>, pipeline: [{<stage>}, {<stage>}, ...]}}

// Almacena el resultado del pipeline en una colección
{$out: {db: "<outDB>", coll: "<outColl>"}}

}
// Realiza un left join a otra colección
{$lookup: {
    from: <coll-to-join>,
        localField: <field-from-the-input-docs>,
        foreignField: <fielf-from-FromCollsDocs>,
        //or
        let: {<var>: <expr>, ... , <var>: <expr>},
        pipeline: [<pipeline-to-run-joined-coll>],
    as: <output-array-field>
    }
}


// ============== Vistas ================
db.createView("<name>", <"source">, [<pipeline>])


// ============== Modelado ================

anidados:
{
    <document-fields>
    <field>: [
        <field-1>,
        <field-2>
    ]
}

referencias:
{
    _id: <X-id>
    <doc-fields>
}
{
    _id: <Y-id>,
    <ref_id>: <X-id>
}

// PRINCIPIO: datos que se acceden juntos se deben almacenar juntos

// embedding: 
// + ) 1 query para recuperar datos
// + ) 1 operacion para Update/Delete
// - ) datos duplicados
// - ) documentos grandes

// referencing:
// + ) puede evitar duplicados de datos
// + ) documentos mas pequeños
// - ) requiere JOIN a nivel de aplicacion
