const config = {
    development: {
        db_uri: `mongodb://localhost:27017/BxlendDb`,
        btc_provider: `http://manjesh:manjeshsingh@127.0.0.1:18332/`,
        queue_uri: "amqp://pvatqfwu:q2IArlfzojvCwH4bbygXNe8Q5UugpK6W@mustang.rmq.cloudamqp.com/pvatqfwu"
    },
    testing: {
        db_uri: `mongodb://localhost:27017/BxlendDb`,
        btc_provider: `http://${process.env.BTC_RPC_USER}:${process.env.BTC_RPC_PASSWORD}@127.0.0.1:18332/`,
        queue_uri: "amqp://pvatqfwu:q2IArlfzojvCwH4bbygXNe8Q5UugpK6W@mustang.rmq.cloudamqp.com/pvatqfwu"
    },
    production: {
        db_uri: `mongodb://mongo:27017/BxlendDb`,
        btc_provider: ``,
        queue_uri: ""
    },
};

module.exports = config[(process.env.NODE_ENV || 'development')];