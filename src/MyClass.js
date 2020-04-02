'use strict'

const Queue = require('bull')

class MyClass {
  constructor() {
    this.queue = null
  }

  async start() {
    this.queue = new Queue('queueName')
    await this.queue.count()
    await this.queue.add({ foo: 'bar' })

    this.queue.process(job => {
      console.log(job)
    })
  }
}

module.exports = MyClass