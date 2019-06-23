import {TimedPromise} from "./TimedPromise";

jest.useFakeTimers();

const getResolvingPromise = (timeout: number, message: string): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(message);
        },         timeout);
    });
};
const getRejectingPromise = (timeout: number, message: string): Promise<string> => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(message);
        },         timeout);
    });
};

describe("TimedPromise", () => {
    it("should resolve if resolved in time", () => {
        const resolvingPromise = getResolvingPromise(1000, "message");
        const promise = TimedPromise.timedOutPromise(resolvingPromise, 2000, "timeout");
        jest.advanceTimersByTime(1005);
        promise.then((res) => {
            expect(res).toEqual("message");
        }).catch((res) => {
            fail(res.toString());
        });
    });
    it("should resolved if finished in time, and no rejection later should happen", () => {
        const resolvingPromise = getResolvingPromise(1000, "message");
        const promise = TimedPromise.timedOutPromise(resolvingPromise, 2000, "timeout");
        jest.advanceTimersByTime(3000);
        promise.then((res) => {
            expect(res).toEqual("message");
        }).catch((err) => {
            fail(err);
        });
    });
    it("should be able to reject promise in case of timeout", () => {
        const resolvingPromise = getResolvingPromise(1000, "message");
        const promise = TimedPromise.timedOutPromise(resolvingPromise, 500, "timeout");
        jest.advanceTimersByTime(501);
        promise.then((res) => {
            fail(res);
        }).catch((res) => {
            expect(res).toEqual("timeout");
        });
    });
    it("should use correct rejection in case of original rejection", () => {
        const resolvingPromise = getRejectingPromise(1000, "message");
        const promise = TimedPromise.timedOutPromise(resolvingPromise, 2000, "timeout");
        jest.advanceTimersByTime(1000);
        promise.then((res) => {
            fail(res);
        }).catch((res) => {
            expect(res).toEqual("message");
        });
    });
    it("should use correct rejection in case of timeout", () => {
        const resolvingPromise = getRejectingPromise(1000, "error_from_original");
        const promise = TimedPromise.timedOutPromise(resolvingPromise, 2000, "timeout_error");
        jest.advanceTimersByTime(1001);
        promise.then((res) => {
            fail(res);
        }).catch((res) => {
            expect(res).toEqual("error_from_original");
        });
    });
});
