import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let depositQ = 'bxlend-deposit';
let exchange = 'bxlend-deposit-events';
// send deposit success response to user
export const depositQueue = async (data) => {
    connect.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        ch.assertQueue(depositQ).then(function (ok) {
            ch.bindQueue(depositQ, exchange, '');
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