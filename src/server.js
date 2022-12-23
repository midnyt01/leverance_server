const http = require('http')
const app = require('./app')
const {mysqlConnect} = require('./services/mysql')

const PORT = 8000


const server = http.createServer(app)


async function startServer () {
    await mysqlConnect()
    
    server.listen(PORT, () => {
        console.log('server is now listening to port 8000')
    })
}

startServer()

