import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { handleChangeGoldPrice, handlePost } from './handlers/routeHandlers.js'
import { sendResponse } from './utils/sendResponse.js'

const PORT = 8000
const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {
     try {
          if (req.method === 'GET') {
               if (!req.url.startsWith('/stream')) {
                    await serveStatic(req, res, __dirname)

               } else {
                    handleChangeGoldPrice(res)
               }
          } else if (req.method === 'POST' && req.url === '/buy') {
               handlePost(req, res, __dirname)
          } else {
               sendResponse(res, 404, 'text/plain', '404 - route not found')
          }
     } catch (error) {
          console.log(error)
          sendResponse(res, 500, 'text/plain', '500 - Internal server error')
     }
     return;
})

server.listen(PORT, () => console.log("Server Running on port 8000"))