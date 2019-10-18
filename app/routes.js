var ObjectID = require('mongodb').ObjectID;
const log4js = require('log4js');
log4js.configure({
    appenders: { fileAppender: { type: 'file', filename: 'events.log' } },
    categories: { default: { appenders: ['fileAppender'], level: 'info' } }
  });
const logger = log4js.getLogger('server');
module.exports = function(app, db){


    app.post('/warehouse/items', (req, res) => {
        const note = { name: req.body.name, amount: +req.body.amount, price: +req.body.price };
        db.collection('warehousecollection').insert(note, (err,result) => {
            if(err) {
                res.send({ 'error': 'an error has occured' });
                logger.error('не удалось добавить данные в бд');
            } else {
                res.send (result.ops[0]);
                logger.info('данные успешно добавлены в базу');
            }
        }); 
    });

    app.get('/warehouse/items/:id', (req, res) => {
        const id = req.params.id; 
        const info = { '_id': new ObjectID(id) };
        db.collection('warehousecollection').findOne(info, (err, item) => {
            if(err) {
                res.send({ 'error': 'an error has occured' });
                logger.error('не удалось получить данные по id');
            } else {
                res.send (item);
                logger.info('данные по id получены успешно');
            }
        });
    });

    app.get('/warehouse/items', (req, res) => {
        db.collection('warehousecollection').find({}).toArray((err, result) => {
            if(err) {
                res.send({ 'error': 'an error has occured' });
                logger.error('не удалось получить данные о товарах');
            } else {
                res.send (result);
                logger.info('данные о всех товарах на складе получены успешно');
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
                logger.error('не удалось изменить данные о товаре');
            } else {
                db.collection('warehousecollection').findOne(info, (err, item) => {
                    if(err) {
                        res.send({ 'error': 'an error has occured' });
                    } else {
                    res.send(item);
                    logger.info('количество товаров успешно изменено');
                    }
                });
            }
        });
    });    
};