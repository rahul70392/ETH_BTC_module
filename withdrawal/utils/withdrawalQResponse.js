import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let withdrawalQ = 'bxlend-withdrawal-response';
let exchange = ' bxlend-withdrawal-events';
// send withdrawal success response to user
export const withdrawalResponseQueue = async (data) => {
    connect.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        ch.assertQueue(withdrawalQ).then(function (ok) {
            ch.bindQueue(withdrawalQ, exchange, '');
            ch.publish(exchange, '', Buffer.from(JSON.stringify(data)));
        });
        setTimeout(function () {
            ch.close();
            process.exit(0);
        }, 500);
    }).catch(err => {
        console.log("connection failed Q", err);
    });
};