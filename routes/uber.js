const { send } = require('micro')
const shortid = require('shortid')
const db = require('../firebase')

const REF = 'sandbox'
const SERVICE = 'uber'

module.exports = {
  getEstimate: (req, res) => {
    console.log('uber get estimate')
    send(res, 200, {
      fare: {
        value: 10000,
        fare_id: shortid.generate(),
        expires_at: Date.now() + (5 * 60 * 1000)
      }
    })
  },

  requestRide: (req, res) => {
    const requestId = shortid.generate()
    db.ref(REF).child(SERVICE).child(requestId).set({
      status: 'processing',
      request_id: requestId,
      driver: null,
      vehicle: null
    })
    send(res, 200, {
      request_id: requestId
    })
  },

  rideStatus: async (req, res) => {
    const { requestId } = req.params
    const snapshot = await db.ref(REF).child(SERVICE).child(requestId).once('value')
    send(res, 200, snapshot.val())
  },

  cancelRide: (req, res) => {
    const { requestId } = req.params
    db.ref(REF).child(SERVICE).child(requestId).set({
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
    const request_id = requestId
    const driver = {
      name: 'John Doe',
      rating: 4.8,
      picture_url: 'https://blogs.timesofindia.indiatimes.com/wp-content/uploads/2015/12/mark-zuckerberg.jpg',
      phone_number: '081234567890'
    }
    const vehicle = {
      license_plate: 'B 1234 AA',
      make: 'Honda',
      model: 'Vario'
    }

    const statuses = {
      'not_found': {
        status: 'no_drivers_available',
        request_id
      },
      'accepted': {
        status: 'accepted',
        request_id, driver, vehicle
      },
      'canceled': {
        status: 'driver_canceled',
        request_id
      },
      'on_the_way': {
        status: 'in_progress',
        request_id, driver, vehicle
      },
      'completed': {
        status: 'completed',
        request_id
      }
    }

    const run = await db.ref(REF).child(SERVICE).child(requestId).set(statuses[status])
    
    return {
      updated: true
    }
  }
}