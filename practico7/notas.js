db.createCollection(name, <options>);

// CRUD operations

db.<collection>.insertOne( <document> )
db.<collection>.insertMany( [ <doc1>, … , <docN> ] )

db.<collection>.findOne( <query filter>, <projection> )
db.<collection>.find( <query filter>, <projection> )

// inclusion
db.<collection>.find( <query filter>, {<field>: 1} )

// exclusion
db.<collection>.find( <query filter>, {<field>: 0} )

// OPERADORES
db.<collection>.find( 
    { <field>: { <operator>: <value> }, ... }
)

// operadores COMPARATIVOS
// $eq  $nq  $gt  $gte  $lt  $lte  $in  $nin

db.inventory.find(
    { qty: { $lt: 30 } }
)

db.inventory.find( 
    {$or: [ { status: "A"}, { qty: { $lt: 30 } } ] }
)

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
    { <field1>: <1 or -1>, <field2>: <1 or -1> ... }
).skip(
    <offset>
).limit(
<number>
)

db.<collection>.updateOne( <query filter>, <update>, <options> )
db.<collection>.updateMany( <query filter>, <update>, <options> )

db.<collection>.deleteOne( <query filter>)
db.<collection>.deleteMany( <query filter> )

db.<collection>.drop()


