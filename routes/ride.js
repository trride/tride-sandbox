const { send, json } = require('micro')
const Ride = require('../models/Ride')

module.exports = {
    getRideStatus: async (req, res) => {
        const { service = '', requestId = ''} = req.params
        const result = await Ride.findOne({service, requestId})
        send(res, 200, result)
    },

    insertStatus: async (req, res) => {
        const { requestId, service, data } = await json(req)
        const result = await Ride.create({requestId, service})
        send(res, 200, result)
    },

    updateStatus: async (req, res) => {
        const { service = '', requestId = '', status = ''} = req.params

        const possibleData = {
            accepted: {
                ...req.params,
                driver: {
                    name: 'John Doe',
                    rating: '4.6'
                }
            },
            completed: {
                ...req.params,
                cost: 20000
            }
        }

        const data = possibleData[status] || {}

        const result = await Ride.updateOne({
            service,
            requestId
        }, {
            service,
            requestId,
            data: JSON.stringify(data)
        })
        send(res, 200, data)
    },

    deleteStatus: async (req, res) => {
        const { requestId, service, data } = await json(req)
        const result = await Ride.remove({requestId, service})
        send(res, 200, result)
    }
}