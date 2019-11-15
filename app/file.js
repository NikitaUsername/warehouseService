 app.put('/warehouse/items/:id/addition/:amount', (req, res) => {
        const id = req.params.id;
        const info = { '_id': new ObjectID(id) };
        const amount = +req.params.amount;
        if (!req.params.amount || !Number.isInteger(+req.params.amount)) {
            logger.error('данные количества введены не верно');
            res.status(400).send('amount is not numeric or not integer');
        } else { async () => {
            logger.info('ger');
            const session = client.startSession();
            const transactionOptions = {
                readPreference: 'primary',
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' }
            };

            try { 
                await session.withTransactions(async () => {
                    
                    await db.collection('warehousecollection').update(info, { $inc: { amount: +amount } }, (err, item) => {
                        if (err) {
                            res.send({ 'error': 'an error has occured' });
                            logger.error('не удалось изменить данные о товаре');
                        } else { async () =>{
                            await db.collection('warehousecollection').findOne(info, (err, item) => {
                                if (err) {
                                    res.send({ 'error': 'an error has occured' });
                                } else {
                                    res.send(item);
                                    logger.info('количество товаров успешно изменено');
                                }
                            });
                        };
                        }
                    });
                }, transactionOptions);
            } finally {
                await session.endSession();
            }
        };
        }
    });