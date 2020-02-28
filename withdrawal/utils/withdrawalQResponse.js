import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let depositQ = 'bxlend-withdrawal-response';
// send withdrawal success response to user
export const withdrawalResponseQueue = async (data) => {
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