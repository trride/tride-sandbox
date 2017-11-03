const { send } = require('micro')
const { router, get, post, del } = require('microrouter')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/trideSandbox')
const { getRideStatus, insertStatus, updateStatus, deleteStatus } = require('./routes/ride')

const notFound = (req, res) => send(res, 404, "Route not found.")

module.exports = router(
    post('/ride', insertStatus),
    get('/ride/:service/:requestId', getRideStatus),
    del('/ride/:service/:reqeustId', deleteStatus),
    post('/ride/:service/:requestId/:status', updateStatus),
    get('/*', notFound)
)