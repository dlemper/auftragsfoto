const path = require('path')
const fs = require('fs')
const util = require('util')
const { pipeline } = require('stream')
const fastify = require('fastify')()

const { exists, rename } = fs.promises

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

fastify.post('/api/file', async function (req, reply) {
  const files = await req.saveRequestFiles();

  for (const file of files) {
    await rename(file.filepath, path.join(outdir, file.filename));
  }

  reply.send()
})

fastify.listen(3000, (err, addr) => console.log('fastify', err, addr, path.join(__dirname, '../client/dist')))