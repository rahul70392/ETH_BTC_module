import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let withdrawalQ = 'bxlend-withdrawal-response';
let exchange = ' bxlend-withdrawal-events';
// send withdrawal success response to user
const exchangeOptions = {
    durable: false,
    autoDelete: false,
};

export const withdrawalResponseQueue = async (data) => {
    connect.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        // ch.assertExchange(exchange, 'topic', exchangeOptions);
        ch.bindQueue(withdrawalQ, exchange, '');
        ch.publish(exchange, '', Buffer.from(JSON.stringify(data)));
        console.log(" Sent %s", data);
    }).catch(err => {
        console.log("connection failed Q", err);
    });
};