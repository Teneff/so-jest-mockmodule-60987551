# StackOverflow [Answer to Question][q]

## Jest genMockFromModule of Bull - can't get mocked function result

Environment:

- NodeJS 12.16.1
- Jest 25.2.4
- Bull 3.13.0

Files:

**bull.js** - (jest mock class) 

    'use strict'

    const Queue = jest.genMockFromModule('bull')

    Queue.prototype.count = jest.genMockFn()
    Queue.prototype.count.mockImplementation(() => Promise.resolve(5))

    Queue.prototype.add = jest.genMockFn()
    Queue.prototype.add.mockImplementation(data => Promise.resolve(null))

    Queue.prototype.process = jest.genMockFn()
    Queue.prototype.process.mockImplementation(fn => fn('process result1'))

    module.exports = Queue


**MyClass.js**

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

**MyClass.test.js**

    /* eslint-disable no-undef */

    'use strict'

    jest.mock('bull')

    const MyClass = require('../../src/MyClass')

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    test('count functions', async () => {
      expect.assertions(9)

      const instance = new MyClass()
      await instance.start()

      await sleep(1000)

      // called 1 time - MyClass.js => await this.queue.count()
      expect(instance.queue.count.mock.calls.length).toBe(1)
      expect(instance.queue.count.mock.calls[0]).toEqual([])

      // called 1 time - MyClass.js => await this.queue.add({ foo: 'bar' })
      expect(instance.queue.add.mock.calls.length).toBe(1)
      expect(instance.queue.add.mock.calls[0]).toEqual([{ foo: 'bar' }])

      // called 1 time - MyClass.js => this.queue.process(...)
      expect(instance.queue.process.mock.calls.length).toBe(1)
      expect(instance.queue.process.mock.calls[0][0]).toBeInstanceOf(Function)

      // here the issues => they all return undefined, but in bull.js every function returns something
      console.log(instance.queue.count.mock.results)
      // set .not.toBeDefined() but they shuold have some value
      expect(instance.queue.count.mock.results[0].value).not.toBeDefined()
      expect(instance.queue.add.mock.results[0].value).not.toBeDefined()
      expect(instance.queue.process.mock.results[0].value).not.toBeDefined()
    })


As commented, the `mock.results` all return undefined, but in bull.js every function returns something.

How can i get the results of the mocked functions?

Also, i have a Class that read from a queue, make some elaborations and add the result in another queue. How can i setup the mock in order to let it read the desired value to elaborate? Check what has been queued as Class result it's ok cause i can read the input of the `queue.add()` mocked function.


[q]: https://stackoverflow.com/questions/60987551/jest-genmockfrommodule-of-bull-cant-get-mocked-function-result