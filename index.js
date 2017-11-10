const { send } = require('micro')
const { router, get, post, put, del } = require('microrouter')

const gojek = require('./routes/gojek')
const grab = require('./routes/grab')
const uber = require('./routes/uber')

const modifyRequest = async (req, res) => {
    const { service, requestId, status } = req.params

    const services = {
        gojek: gojek.modifyRequest,
        grab: grab.modifyRequest,
        uber: uber.modifyRequest,
        null: (requestId, status) => 'invalid service name'
    }

    const func = services[service] || services.null
    const result = await func(requestId, status)
    send(res, 200, result)
}

const notFound = (req, res) => send(res, 404, "Route not found.")

module.exports = router(
    put('/ride/:service/:requestId/:status', modifyRequest),

    //gojek
    post('/gojek/gojek/v2/calculate/gopay', gojek.getEstimate),
    post('/gojek/go-ride/v4/bookings', gojek.requestRide),
    get('/gojek/v1/customers/active_bookings', gojek.getActiveBooking),
    get('/gojek/gojek/v2/booking/findByOrderNo/:requestId', gojek.rideStatus),
    put('/gojek/gojek/v2/booking/cancelBooking', gojek.cancelRide),
    
    // grab
    post('/grab/api/passenger/v3/quotes', grab.getEstimate),
    post('/grab/api/passenger/v3/rides', grab.requestRide),
    get('/grab/api/passenger/v3/rides/:requestId/status', grab.rideStatus),
    del('/grab/api/passenger/v3/rides/:requestId', grab.cancelRide),
    
    // uber
    post('/uber/requests/estimate', uber.getEstimate),
    post('/uber/requests', uber.requestRide),
    get('/uber/requests/:requestId', uber.rideStatus),
    del('/uber/requests/:requestId', uber.cancelRide),
    
    get('/*', notFound)
)