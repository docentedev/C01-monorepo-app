

import { FastifyInstance, UserRequest } from "fastify"
import citiesDb from '../../models/cities'

const routes = (instance: FastifyInstance, opts: any, next: () => void) => {
    const qb = citiesDb(instance.pg)
    instance.get('/', async (req: UserRequest, reply) => {
        try {
            const { page = 1, size = 10, sort = 'desc', order = 'id' } = req.query
            const result = await qb.getAllPaginate({ page, size, sort, order })
            reply.send(result)
        } catch (error) {
            reply.send(error)
        }
    })

    instance.get('/:id', async (req: UserRequest, reply) => {
        try {
            const result = await qb.getBy('id', req.params.id)
            reply.send(result)
        } catch (error) {
            reply.send(error)
        }
    })
    
    // /search?q=%s&fields=%s
    instance.get('/search', async (req: UserRequest, reply) => {
        try {
            const { q } = req.query
            if (!q || `${q ?? ''}`.length < 3) {
                throw new Error('Search query must be at least 3 characters long')
            }
            const result = await qb.search(q)
            reply.send(result)
        } catch (error) {
            reply.send(error)
        }
    })

    next()
}

export default routes
