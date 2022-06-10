import Fastify from 'fastify'
require('dotenv').config()

const fastify = Fastify({
    logger: false
})

fastify.register(require('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL,
})

fastify.register(require('./routes/musicians'), { prefix: 'api/v1/musicians' })
fastify.register(require('./routes/cities'), { prefix: 'api/v1/cities' })

fastify.listen(3001, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})