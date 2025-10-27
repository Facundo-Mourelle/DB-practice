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




