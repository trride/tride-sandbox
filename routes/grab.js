const { send } = require('micro')
const shortid = require('shortid')
const db = require('../firebase')

const REF = 'sandbox'
const SERVICE = 'grab'

module.exports = {
  getEstimate: (req, res) => {
    send(res, 200, [
      {
        upperBound: 1000000,
        lowerBound: 1000000,
        fixed: true,
        signature: shortid.generate()
      }
    ])
  },

  requestRide: (req, res) => {
    const requestId = shortid.generate()
    db.ref(REF).child(SERVICE).child(requestId).set({
      status: 'ALLOCATING',
      request_id: requestId,
      driver: null,
      vehicle: null
    })
    send(res, 200, {
      code: requestId
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
      status: 'CANCELLED',
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
    // const driver = {
    //   name: 'John Doe',
    //   rating: 4.8,
    //   picture_url: 'https://blogs.timesofindia.indiatimes.com/wp-content/uploads/2015/12/mark-zuckerberg.jpg',
    //   phone_number: '081234567890'
    // }
    // const vehicle = {
    //   license_plate: 'B 1234 AA',
    //   make: 'Honda',
    //   model: 'Vario'
    // }

    const statuses = {
      'not_found': {
        reason: 'unallocated'
      },
      'accepted': {
        status: 'ALLOCATED',
        activeStepIndex: 0
      },
      'canceled': {
        status: 'CANCELLED'
      },
      'on_the_way': {
        status: 'ALLOCATED',
        activeStepIndex: 1
      },
      'completed': {
        status: 'COMPLETED'
      }
    }

    const run = await db.ref(REF).child(SERVICE).child(requestId).set(statuses[status])
    
    return {
      updated: true
    }
  }
}