use('mflix')

// EJERCICIO 1
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
