//Listar los 3 items con mayor cantidad dentro de los inventarios con estado "A". Listar en orden alfabético si los items tiene la misma cantidad.
db.inventory.find( 
    { "status":  "A" },
    { "item": 1, "qty": 1} 
).sort(
    { qty: -1, item: 1 }
).skip(
    0
).limit(3)
