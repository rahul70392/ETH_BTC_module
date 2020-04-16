import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let withdrawalQ = 'bxlend-withdrawal-response';
let exchange = ' bxlend-withdrawal-events';
// send withdrawal success response to user
export const withdrawalResponseQueue = async (data) => {
    connect.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        return ch.assertQueue(withdrawalQ).then(function (ok) {
            ch.bindQueue(withdrawalQ, exchange, '');
            return ch.publish(exchange, '', Buffer.from(JSON.stringify(data)));
        });
    }).catch(err => {
        console.log("connection failed Q", err);
    });
};