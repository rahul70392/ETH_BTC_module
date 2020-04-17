import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let depositQ = 'bxlend-deposit';
let exchange = 'bxlend-deposit-events';
const exchangeOptions = {
    durable: false,
    autoDelete: false,
};
// send deposit success response to user
export const depositQueue = async (data) => {
    connect.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        // ch.assertExchange(exchange, 'topic', exchangeOptions);
        ch.bindQueue(depositQ, exchange, '');
        ch.publish(exchange, '', Buffer.from(JSON.stringify(data)));
        console.log("deposit response Q", data);
    }).catch(err => {
        console.log("connection failed Q", err);
    });
};