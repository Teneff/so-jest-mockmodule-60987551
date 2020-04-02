/* eslint-disable no-undef */

"use strict";

jest.mock("bull");

const Queue = require("bull");

const MyClass = require("./MyClass");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("MyClass", () => {
  let instance;
  beforeAll(async () => {
    instance = new MyClass();
    await instance.start();
  });

  it("should have created one bull instance", () => {
    expect(Queue.mock.instances).toHaveLength(1);
  });

  describe("the first instance", () => {
    let firstBull;
    beforeAll(() => {
      [firstBull] = Queue.mock.instances;
    });

    describe("count", () => {
      let firstResult;
      describe("first result", () => {
        beforeAll(() => {
          [firstResult] = firstBull.count.mock.results;
        });

        it("should have returned", () => {
          return expect(firstResult.value).resolves.toEqual(5);
        });
      });
    });

    describe("process", () => {
      it("should have been called with a Function", () => {
        expect(firstBull.process).toHaveBeenCalledWith(expect.any(Function));
      });

      it("should have returned", () => {
        expect(firstBull.process.mock.results).toMatchInlineSnapshot(`
          Array [
            Object {
              "type": "return",
              "value": undefined,
            },
          ]
        `);
      });
    });
  });
});
