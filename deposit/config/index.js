const config = {
    development: {
        db_uri: `mongodb://localhost:27017/BxlendDb`,
        btc_provider: `http://bxlenduser:bxlendpassword@10.15.0.9:8332/`,
        server_uri: 'http://localhost:3000',
        queue_uri: "amqp://pvatqfwu:q2IArlfzojvCwH4bbygXNe8Q5UugpK6W@mustang.rmq.cloudamqp.com/pvatqfwu"
    },
    testing: {
        db_uri: `mongodb://localhost:27017/BxlendDb`,
        btc_provider: `http://manjesh:manjeshsingh@127.0.0.1:18332/`,
        server_uri: 'http://localhost:3000',
        queue_uri: "amqp://pvatqfwu:q2IArlfzojvCwH4bbygXNe8Q5UugpK6W@mustang.rmq.cloudamqp.com/pvatqfwu"
    },
    production: {
        db_uri: `mongodb://mongo:27017/BxlendDb`,
        btc_provider: ``,
        server_uri: '',
        queue_uri: ""
    },
};

module.exports = config[(process.env.NODE_ENV || 'development')];