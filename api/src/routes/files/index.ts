const fs = require('fs')
const util = require('util')
const path = require('path')
const { pipeline } = require('stream')
const pump = util.promisify(pipeline)

import { FastifyInstance, UserRequest, FastifyRequest } from "fastify"
import getContentType from "../../utils/getContentType"
import musiciansDb from '../../models/musicians'
// import musiciansDb from '../../models/musicians'

const routes = async (instance: FastifyInstance, opts: any, done: () => void) => {
  const qb = musiciansDb(instance.pg)
  //const qb = musiciansDb(instance.pg)
  /*instance.post('/', async (req: FastifyRequest, reply) => {
    try {
      const data = await req.file()
      const uploadPath = path.join(__dirname, '../../uploads')
      
      await pump(data.file, fs.createWriteStream(path.join(uploadPath, data.filename)))
      
      reply.send()
    } catch (error) {
      reply.send(error)
    }
  })*/
  instance.post('/', {
    handler: async (req: any, reply: any) => {
      console.log('> ------------------------ >')
      const file = await req.file()
      console.log(file)
      const uploadPath = path.join(__dirname, '../../../../uploads')

      const ext = path.extname(file.filename)
      const id = file.fields.id.value
      const filePath = path.join(uploadPath, `${id}${ext}`)


      console.log(file.fields.id.value)
      console.log(file)
      await pump(file.file, fs.createWriteStream(filePath))
      // update musician image
      const result = await qb.updateImage(id, `${id}${ext}`)
      reply.send(result)
    }
  })

  instance.get('/:filename', {
    handler: async (req: any, reply: any) => {
      const filename = req.params.filename
      const uploadPath = path.join(__dirname, '../../../../uploads')
      const filePath = path.join(uploadPath, filename)
      //const readStream = fs.createReadStream(filePath)
      //reply.header('Content-Type', getContentType(filePath))
      //readStream.pipe(reply)
      try {
        const buffer = fs.readFileSync(filePath)
        reply.header('Content-Type', getContentType(filePath))
        reply.send(buffer)
      } catch (error) {
        reply.status(404).send({ error: 'File not found' })
      }
    },
  })

  done()
};

export default routes;