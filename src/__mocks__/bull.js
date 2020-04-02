'use strict'

const Queue = jest.genMockFromModule('bull')

Queue.prototype.count.mockResolvedValue(5)

Queue.prototype.add.mockImplementation(data => Promise.resolve(null))

Queue.prototype.process.mockImplementation(fn => fn('process result1'))

module.exports = Queue
