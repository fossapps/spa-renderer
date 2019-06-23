// tslint:disable-next-line:no-unnecessary-class
export class TimedPromise {
    public static timedOutPromise<T>(promise: Promise<T>, timeout: number, message: string): Promise<T> {
        return Promise.race([promise, TimedPromise.getRejectingPromise(timeout, message)]) as Promise<T>;
    }

    private static getRejectingPromise(timeout: number, message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(message);
            },         timeout);
        });
    }
}
