var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db){


    app.post('/warehouse/items', (req, res) => {
        // Здесь будем создавать заметку.
        const note = { name: req.body.name, amount: +req.body.amount, price: +req.body.price };
        db.collection('warehousecollection').insert(note, (err,result) => {
            if(err) {
                res.send({ 'error': 'an error has occured' });
            } else {
                res.send (result.ops[0]);
            }
        }); 
    });

    app.get('/warehouse/items/:id', (req, res) => {
        const id = req.params.id; 
        const info = { '_id': new ObjectID(id) };
        db.collection('warehousecollection').findOne(info, (err, item) => {
            if(err) {
                res.send({ 'error': 'an error has occured' });
            } else {
                res.send (item);
            }
        });
    });

    app.get('/warehouse/items', (req, res) => {
        db.collection('warehousecollection').find({}).toArray((err, result) => {
            if(err) {
                res.send({ 'error': 'an error has occured' });
            } else {
                res.send (result);
            }
        });
    });
    
    app.put('/warehouse/items/:id/addition/:amount', (req,res) =>{
        const id = req.params.id;
        const info = { '_id': new ObjectID(id) };
        const amount = +req.params.amount;
        
        db.collection('warehousecollection').update( info, {$inc: { amount: +amount } }, (err, item) => {
            if(err) {
                res.send({ 'error': 'an error has occured' });
            } else {
                db.collection('warehousecollection').findOne(info, (err, item) => {
                    if(err) {
                        res.send({ 'error': 'an error has occured' });
                    } else {
                    res.send(item);
                    }
                });
            }
        });
    });    
};