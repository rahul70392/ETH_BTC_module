import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let depositQ = 'bxlend-deposit';
// Publisher
export const depositQueue = async (data) => {
    connect.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        return ch.assertQueue(depositQ).then(function (ok) {
            return ch.sendToQueue(depositQ, Buffer.from(JSON.stringify(data)));
        });
    }).catch(err => {
        console.log("connection failed Q", err);
    });
};