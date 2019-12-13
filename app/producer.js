var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var exchange = 'warehouseCommandExchange';
    var msg =  {
      orderID: 1,
      id: '5da872187300a32d8433c3cf',
      amount: 4
    };

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
    
    channel.publish(exchange, 'addItemToOrder', Buffer.from(JSON.stringify(msg)));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() { 
    connection.close(); 
    process.exit(0); 
  }, 500);
});