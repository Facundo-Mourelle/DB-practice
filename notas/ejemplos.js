//Listar los 3 items con mayor cantidad dentro de los inventarios con estado "A". Listar en orden alfabético si los items tiene la misma cantidad.
db.inventory.find( 
    { "status":  "A" },
    { "item": 1, "qty": 1} 
).sort(
    { qty: -1, item: 1 }
).skip(
    0
).limit(3)



// COUNT

db.theaters.aggregate([
    {$group: {
        _id: "$location.address.state",
        total: {$count: {}}
        }
    }
])


// UNWIND

db.survey.aggregate( [
    {
        $unwind: "$results"
    }
] )

// REPLACE ROOT

db.survey.aggregate( [
    { $unwind: "$results"  },
    {
        $match: { "results.score": { $gte: 9 } }
    },
    {
        $replaceRoot: { newRoot: "$results" }
    }
] )

// GROUP

// varios campos
db.sales.aggregate([
    {
        $group: {
            _id: null,
            totalQuanty: { $sum: "$qty"},
            count: { $count: {}}
        }
    }
])

// unico campo
db.sales.aggregate( [
    {
        $group: {
            _id: "$item",
            tamount: { $sum: { $multiply: [ "$price", "$qty" ] } },
        }
    }
] )

// UNION WITH

db.cats.aggregate( [
    {
        $unionWith: {
            coll: "dogs",
            pipeline: [ { $match: { weight: { $lt: 30 } } } ]
        }
    }
] )


// OUT

db.cats.aggregate( [
    {
        $unionWith: {
            coll: "dogs",
            pipeline: [ { $match: { weight: { $lt: 30 } } } ]
        }
    },
    {   $unset: "_id"   },
    {
        $out: { db: "samples", coll: "pets" }
    }
] )

db.pets.find()


// LOOKUP 

//simple join

db.posts.aggregate( [
    	      {
        	      	$lookup: {
            		      from: "comments",
            		      localField: "_id",
            		      foreignField: "post_id",
            		      as: "cmts"
        	            }   
                  }
] )

// multiple join

db.posts.aggregate( [
    { 
        $lookup: {
            from: "comments",
            let: { post_likes: "$likes", post_id: "$_id" },
            pipeline: [
                { 
                    $match: { 
                        $expr: { 
                            $and: [
                                { $eq: ["$post_id", "$$post_id" ] },
                                { $gt: [ "$likes", "$$post_likes" ] }
                            ]
                       }
                   }
                }
            ],
            as: "cmts"
        }
    }
] )


// VIEW

db.createView(
       "firstYears",
       "students",
       [ { $match: { year: 1 } } ]
)
