// EJERCICIO 1

db.listingsAndReviews.aggregate([
    {
        $addFields: {
            review_count: { $size: "$reviews" },
        }
    },
    {
        $group: {
            _id: "$address.country",
            rating: { $avg: "$review_scores.review_scores_rating" },
            total_reviews: { $sum: "$review_count" }
        }
    },
    {
        $project: {
            _id: 0,
            country: "$_id",
            rating: 1,
            total_reviews: 1
        }
    },
    { $sort: { rating: -1 } }
])

// EJERCICIO 2

db.listingsAndReviews.aggregate([
    {
        $addFields: {
            review_count: { $size: "$reviews" },
        }
    },
    { $unwind: "$reviews" },
    { $sort: { "reviews.date": -1 } },
    { $limit: 20 },
    {
        $group: {
            _id: "$_id",
            name: { $first: "$name" },
            last_review: { $first: "$reviews.date" },
            ammount: { $first: "$review_count" }
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            last_review: 1,
            ammount: 1
        }
    },
    {
        $sort: {
            ammount: -1
        }
    }
])

// EJERCICIO 3

db.createView("top10_most_common_amenities", "listingsAndReviews", [
    { $unwind: "$amenities" },
    {
        $group: {
            _id: "$amenities",
            total_count: { $count: {} }
        }
    },
    { $sort: { total_count: -1 } },
    { $limit: 10 },
    {
        $project: {
            _id: 0,
            amenity: "$_id",
            ammount: "$total_count"
        }
    }
])


// EJERCICIO 4

db.listingsAndReviews.updateMany(
    {
        $and: [
            {
                "address.country": "Brazil"
            },
            {
                "review_scores.review_scores_rating": { $exists: true }
            }
        ]
    },
    [
        {
            $set: {
                quality_label: {
                    $switch: {
                        branches: [
                            {
                                case: { $gte: ["$review_scores.review_scores_rating", 90] },
                                then: "High"
                            },
                            {
                                case: { $gte: ["$review_scores.review_scores_rating", 70] },
                                then: "Medium"
                            },
                        ],
                        default: "Low"
                    }
                }
            }
        }
    ])

// EJERCICIO 5a)

db.runCommand({
    collMod: "listingsAndReviews",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "address", "amenities", "review_scores", "reviews"],
            properties: {
                name: { bsonType: "string" },
                address: {
                    bsonType: "object",
                    required: ["street", "suburb", "government_area", "market", "country", "country_code", "location"],
                    properties: {
                        street: { bsonType: "string" },
                        suburb: { bsonType: "string" },
                        government_area: { bsonType: "string" },
                        market: { bsonType: "string" },
                        country: { bsonType: "string" },
                        country_code: { bsonType: "string" },
                        location: {
                            bsonType: "object",
                            required: ["type", "coordinates", "is_location_exact"],
                            properties: {
                                type: { bsonType: "string" },
                                coordinates: {
                                    bsonType: "array",
                                    items: {
                                        bsonType: "double",
                                    },
                                    maxItems: 2,
                                    minItems: 2
                                },
                                is_location_exact: { bsonType: "bool" }
                            }
                        }

                    }
                },
                amenities: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    }
                },
                review_scores: { bsonType: "object" },
                reviews: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["_id", "date", "listing_id", "reviewer_id", "reviewer_name"],
                        properties: {
                            _id: { bsonType: "int" },
                            date: { bsonType: "date" },
                            listing_id: { bsonType: "int" },
                            reviewer_id: { bsonType: "int" },
                            reviewer_name: { bsonType: "string" },
                            comments: { bsonType: "string" }
                        }
                    },
                }
            }
        }
    }
})

// EJERCICIO 5b)

// Caso 1 de fallo
// Falla porque no posee campo amenities
db.listingsAndReviews.insertOne(
    {
        name: "Famaf",
        address: {
            street: "Por ciudad universitaria",
            suburb: "",
            government_area: "",
            market: "",
            country: "Argentina",
            country_code: "AR",
            location: {
                type: "Point",
                coordinates: [3.14, 2.71],
                is_location_exact: false
            }
        },
        review_scores: {},
        reviews: []
    }
)

// Caso 2 de fallo
// Falla porque el campo address.location.coordinates no posee elementos del tipo "double"
db.listingsAndReviews.insertOne(
    {
        name: "Famaf",
        address: {
            street: "Por ciudad universitaria",
            suburb: "",
            government_area: "",
            market: "",
            country: "Argentina",
            country_code: "AR",
            location: {
                type: "Point",
                coordinates: [0.00, 1.00],
                is_location_exact: false
            }
        },
        amenities: [],
        review_scores: {},
        reviews: []
    }
)

// Caso de EXITO 
db.listingsAndReviews.insertOne(
    {
        name: "Famaf",
        address: {
            street: "Por ciudad universitaria",
            suburb: "",
            government_area: "",
            market: "",
            country: "Argentina",
            country_code: "AR",
            location: {
                type: "Point",
                coordinates: [3.14, 2.71],
                is_location_exact: false
            }
        },
        amenities: [],
        review_scores: {},
        reviews: []
    },
)
