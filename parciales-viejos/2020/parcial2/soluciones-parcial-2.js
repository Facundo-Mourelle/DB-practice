use('analytics');

// Operaciones CRUD

/*
Ejercicio 1:

Listar el username, email y la dirección de los clientes que nacieron entre Febrero de 1990 y Junio de 1999, tienen exactamente cinco cuentas y sus nombres (name) empiezan con una 'J' o 'R'. 

*/

db.customers.find(
    {
        birthdate: {
            $gte: ISODate('1990-02-01'), 
            $lte: ISODate('1999-06-30')
        },
        accounts: {
            $size: 5
        },
        $or: [{name: /^J/}, {name: /^R/}]
    },
    {username: 1, email: 1, address:1, _id:0}
)


/*
Ejercicio 2:

Listar el account_id y transaction_count del top 10 de las cuentas con mayor cantidad de transacciones tal que al menos una de sus transacciones es una venta (sell) con una cantidad (amount) mayor a 9990.

*/

db.transactions.find(
    {
        transactions: { 
            $elemMatch: {
                transaction_code: "sell",
                amount: {
                    $gt: 9990
                }
            }
        }
    },
    {account_id: 1, transaction_count: 1, _id:0}
)
.sort({transaction_count: -1})
.limit(10)

/*
Ejercicio 3:

Para todas las cuentas que tienen ambos productos 'Brokerage' y 'Commodity' (puede tener otros productos adicionales) se pide incrementar el limite en 500 y agregar un nuevo producto llamado 'Trackers' en el arreglo products. 

*/

db.accounts.updateMany(
    {
        products:{
            $all: ['Brokerage', 'Commodity']
        }
    },
    {
        $inc: {limit: 500},
        $addToSet: {products: 'Trackers'}
    }
)

// Pipeline de Agregación

/*
Ejercicio 4:

Crear la vista 'latest_transaction_date_per_account' que liste el _id, account_id, latest_transaction_date donde latest_transaction_date es la fecha de la transacción más reciente realizada por cada cuenta. Listar ordenados por fecha de transacción más reciente. (Hint: Recordar que algunos operadores de agregación ($max, entre otros) pueden ser usados en el stage $project)

*/

pipeline = [
    {
        $project: {
            account_id: 1,
            latest_transaction_date: {
                $max: "$transactions.date"
            }      
        }
    },
    {
        $sort: {latest_transaction_date: -1}
    }
]

db.createView('latest_transaction_date_per_account', 'transactions', pipeline)

db.latest_transaction_date_per_account.find({}).pretty()

/*
Ejercicio 5:

Listar el id de la cuenta junto con la suma y promedio del (monto) total de las transacciones de compra ('buy') por cuenta. Limitar el resultado al top 10 de las cuentas que mas transacciones de compras realizaron. (Hint: convertir el valor de campo total a double)
El esquema de datos de salida debe ser el siguiente:
  {
    account_id: "integer",
    buy_total_sum: "double",
    buy_total_average: "double"
  }

*/

db.transactions.aggregate([
    {
        $unwind: "$transactions"
    },
    {
        $match: {
            "transactions.transaction_code": "buy"
        }
    },
    {
        $group: {
            _id: "$account_id",
            buy_total_sum: {
                $sum: {
                    $toDouble: "$transactions.total"
                }    
            },
            buy_total_average: {
                $avg: {
                    $toDouble: "$transactions.total"
                }
            },
            count: {
                $sum: 1
            }
        }
    },
    {
        $sort: {count: -1}
    },
    {
        $project: {
            account_id: "$_id",
            buy_total_sum: 1,
            buy_total_average: 1,
            _id: 0
        }
    },
    {
        $limit: 10
    }
])

/*
Ejercicio 6:

Listar el username y nombre de los clientes junto con los productos asociados a sus cuentas (no se deben mostrar los productos duplicados).
Ejemplo parcial del resultado:
[
  {
    username: 'fmiller',
    name: 'Elizabeth Ray',
    products: [
      'Brokerage',
      'Commodity',
      'CurrencyService',
      'Derivatives',
      'InvestmentFund',
      'InvestmentStock',
      'Trackers'
    ]
  }
...
]

(Hint 1, para solución poco eficiente: El ejercicio puede ser resuelto con los stages y operadores visto en clases)
(Hint 2, para una solución eficiente: Se debe (i) usar el operador $reduce para combinar los distintos arreglos products relacionados a las cuentas de un cliente y (ii) usar el operador $setUnion para evitar nombre de productos duplicados)

*/

/*
Solución poco eficiente
*/

db.customers.aggregate([
    {
        $lookup: {
            from: 'accounts',
            localField: 'accounts',
            foreignField: 'account_id',
            as: 'rel_accounts'
        }
    },
    {
        $unwind: "$rel_accounts"
    },
    {
        $unwind: "$rel_accounts.products"
    },
    {
        $group: {
            _id: {
                username: "$username",
                name: "$name"
            },
            products: {
                $addToSet: "$rel_accounts.products"
            }
        }
    },
    {
        $project: {
            username: "$_id.username",
            name: "$_id.name",
            products: 1,
            _id: 0
        }
    }
])

/*
Solución eficiente
*/

db.customers.aggregate([
    {
        $lookup: {
            from: 'accounts',
            localField: 'accounts',
            foreignField: 'account_id',
            as: 'rel_accounts'
        }
    },
    {
        $project: {
            username: 1,
            name:1,
            products: {
                $reduce: {
                    input: "$rel_accounts.products",
                    initialValue: [ ],
                    in: { $setUnion : ["$$value", "$$this"] }
                }
            },
            _id: 0
        }
    }
])

// Modelado de Datos

/*
Ejercicio 7:

Evolucionar el modelo de datos de analytics para que pueda satisfacer las siguientes necesidades:
(  i) Se debe poder almacenar reviews de productos realizados por los clientes. Los reviews contienen un conjunto de datos en común (por ejemplo, nombre de producto, texto del review, rating, fecha del review y el cliente que realiza el review) y tienen otro datos que son propios de cada producto.
( ii) El modelo debe permitir recuperar la siguiente información realizando una sola consulta: Listar el rating promedio por producto dado un rango de fechas.
(iii) Se debe poder agregar validación de esquema para los campos siguiendo algun criterio que considere adecuado.

Importante: Justificar cada decisión tomada (reglas de modelado/patrón de diseño/sentido común, etc).

7.1 Crear al menos 2 reviews para cada uno de los siguientes productos: 'InvestmentStock' y 'InvestmentFund'. Imagine nombres de campos para los datos que son propios de cada producto.
7.2 Crear la consulta solicitada en (ii) con un rango de fechas concreto.
7.3 Definir la regla de validación esquema usando jsonschema solicitado en (iii)
7.4 Agregue un documento en donde la validación sea exitosa y otro en donde falle.

*/

/* 7.1

Justificaciones:
    - Relaciones: One-To-Squillions entre customer y reviews
    - Patrones de diseños: Polymorphic
*/

db.reviews.insertOne(
    {
        product: "InvestmentStock",
        text: "This a comment for the InvestmentStock product.",
        date: ISODate('2020-10-22'),
        username: "andrewhamilton",
        rating: 8.0,
        product_info: {
            field1: "Value 1",
            field2: "Value 2" 
        }
    }
)

db.reviews.insertOne(
    {
        product: "InvestmentStock",
        text: "This other comment for the InvestmentStock product.",
        date: ISODate('2020-09-22'),
        username: "valenciajennifer",
        rating: 9.0,
        product_info: {
            field1: "Value 11",
            field2: "Value 22" 
        }
    }
)

db.reviews.insertOne(
    {
        product: "InvestmentFund",
        text: "This a comment for the InvestmentFund product.",
        date: ISODate('2020-11-20'),
        username: "valenciajennifer",
        rating: 7.0,
        product_info: {
            field3: "Value 3",
            field4: "Value 4" 
        }
    }
)

db.reviews.insertOne(
    {
        product: "InvestmentFund",
        text: "This other comment for the InvestmentFund product.",
        date: ISODate('2020-06-20'),
        username: "andrewhamilton",
        rating: 10.0,
        product_info: {
            field3: "Value 31",
            field4: "Value 42" 
        }
    }
)

// 7.2

db.reviews.aggregate([
    {
        $match: {
            date: {$gte: ISODate('2020-01-01'), $lte: ISODate('2020-11-30')}
        }    
    },
    {
        $group: {
          _id: "$product",
          rating_average: {
              $avg: "$rating"
          }
        }
    }
])

/* 7.3
Justificaciones:

    - Se valida el tipo de los campos común a todos los reviews.
    - Se require los campos común a todos los reviews.
    - No se realiza validaciones de los campos particulares a cada producto 

*/

db.runCommand( {
   collMod: "reviews",
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "product", "text", "date", "username", "rating" ],
      properties: {
         product: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         text: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         date: {
            bsonType: "date",
            description: "must be a date and is required"
         },
         username: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         rating: {
            bsonType: "double",
            description: "must be a double and is required"
         }
      }
   } },
   validationLevel: "moderate"
} )

// 7.4

// Success Validation

db.reviews.insertOne(
    {
        product: "InvestmentFund",
        text: "This other comment for the InvestmentFund product.",
        date: ISODate('2020-05-20'),
        username: "charleshudson",
        rating: 8.0,
        product_info: {
            field3: "Value 311",
            field4: "Value 422" 
        }
    }
)

// Failed validation

db.reviews.insertOne(
    {
        product: "InvestmentFund",
        text: "This other comment for the InvestmentFund product.",
        date: '2020-05-20',
        username: "charleshudson",
        rating: "8.0",
        product_info: {
            field3: "Value 311",
            field4: "Value 422" 
        }
    }
)