const path = require('path')
const fs = require('fs')
const util = require('util')
const { pipeline } = require('stream')
const fastify = require('fastify')()

const { exists } = fs.promises

const pump = util.promisify(pipeline)

fastify.register(require('fastify-sensible'))

fastify.register(require('fastify-multipart'))

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../client/dist'),
})

fastify.head('/api/:photo', async (req, reply) => {
  if (!(await req.params.photo)) {
    throw fastify.httpErrors.notFound();
  }
})

fastify.get('/api/:photo', async (req, reply) => {
  throw fastify.httpErrors.notFound()
})

fastify.post('/', async function (req, reply) {
  // process a single file
  // also, consider that if you allow to upload multiple files
  // you must consume all files otherwise the promise will never fulfill
  const data = await req.file()

  data.file // stream
  data.fields // other parsed parts
  data.fieldname
  data.filename
  data.encoding
  data.mimetype

  // to accumulate the file in memory! Be careful!
  //
  // await data.toBuffer() // Buffer
  //
  // or

  await pump(data.file, fs.createWriteStream(data.filename))

  // be careful of permission issues on disk and not overwrite
  // sensitive files that could cause security risks
  
  // also, consider that if the file stream is not consumed, the promise will never fulfill

  reply.send()
})

fastify.listen(3000, (err, addr) => console.log('fastify', err, addr, path.join(__dirname, '../client/dist')))