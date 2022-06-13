import Fastify from 'fastify'
require('dotenv').config()
import citiesRoute from './routes/cities'

const fastify = Fastify({
    logger: true
})

async function onFile(part: any) {
    const buff = await part.toBuffer()
    const decoded = Buffer.from(buff.toString(), 'base64').toString()
    part.value = decoded // set `part.value` to specify the request body value
}

fastify.register(require('@fastify/multipart'), {
    limits: { fileSize: 50 * 1024 * 1024 },
    // attachFieldsToBody: 'keyValues',
    // onFile
})

fastify.register(require('@fastify/cors'), { origin: '*' })

fastify.register(require('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL,
})

fastify.register(require('./routes/files'), { prefix: 'api/v1/files' })
fastify.register(require('./routes/musicians'), { prefix: 'api/v1/musicians' })
fastify.register(citiesRoute, { prefix: 'api/v1/cities' })

fastify.listen({ port: 3001 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
    fastify.log.info(`Server listening on ${address}`)
})