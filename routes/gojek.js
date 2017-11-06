const { send } = require('micro')
const shortid = require('shortid')
const db = require('../firebase')

const REF = 'sandbox'
const SERVICE = 'gojek'

module.exports = {
  getEstimate: (req, res) => {
    console.log('gojek get estimate sandbox')
    send(res, 200, {
      totalCash: 10000,
      estimate_token: shortid.generate()
    })
  },

  getActiveBooking: async (req, res) => {
    const snapshot = await db.ref(REF).child(SERVICE).once('value')
    const val = snapshot.val()
    const bookings = Object.keys(val)
        .filter(key => val[key].status != 'completed')
        .map(key => ({order_number: key}))
    
    send(res, 200, {
        data: {
            bookings
        }
    })
  },

  requestRide: (req, res) => {
    const requestId = shortid.generate()
    db.ref(REF).child(SERVICE).child(requestId).set({
        status: 'SEARCHING',
        order_number: requestId
    })
    send(res, 200, {
      order_number: requestId
    })
  },

  rideStatus: async (req, res) => {
    const { requestId } = req.params
    const snapshot = await db.ref(REF).child(SERVICE).child(requestId).once('value')
    send(res, 200, snapshot.val())
  },

  cancelRide: (req, res) => {
    const payload = req.body //noticed
    db.ref(REF).child(SERVICE).child(payload.orderNo).set({
      status: 'driver_canceled',
      request_id: requestId,
      driver: null,
      vehicle: null
    })
    send(res, 200, {
      success: true
    })
  },

  modifyRequest: async (requestId, status) => {
    const order_number = requestId
    const driver = {
      driverName: 'John Doe',
      rating: 4.8,
      driverPhoto: 'https://blogs.timesofindia.indiatimes.com/wp-content/uploads/2015/12/mark-zuckerberg.jpg',
      driverPhone: '081234567890'
    }
    const vehicle = {
      noPolisi: 'B 1234 AA',
      driverVehicleBrand: 'Honda Vario'
    }

    const statuses = {
      'not_found': {
        order_number
      },
      'accepted': {
        status: 'DRIVER_FOUND',
        order_number, ...driver, ...vehicle
      },
      'canceled': {
        status: 'driver_canceled',
        cancelReasonId: 1,
        order_number
      },
      'on_the_way': {
        status: 'PICKED_UP',
        order_number, ...driver, ...vehicle
      },
      'completed': {
        status: 'completed',
        order_number, ...driver, ...vehicle
      }
    }

    const run = await db.ref(REF).child(SERVICE).child(requestId).set(statuses[status])
    
    return {
      updated: true
    }
  }
}