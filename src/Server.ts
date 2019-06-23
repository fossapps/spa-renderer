// tslint:disable-next-line:import-name
import autobind from "autobind-decorator";
import {Request, Response} from "express";
import express from "express";
import {LaunchOptions} from "puppeteer";
import {Chrome} from "./drivers/Chrome";
import {IDriver} from "./drivers/IDriver";
export class Server {
    private static defaultLaunchOptions: LaunchOptions = {
        headless: true,
        executablePath: Chrome.getChromeLocation(),
        defaultViewport: {width: 1440, height: 718}
    };
    private readonly browser: IDriver;
    constructor(private options: LaunchOptions = Server.defaultLaunchOptions) {
        this.browser = new Chrome(this.options);
    }

    public static async start(options: LaunchOptions = Server.defaultLaunchOptions): Promise<void> {
        const server = new Server(options);
        console.info("initializing server...");
        await server.init();
        express().get("/render", server.serve).listen(3000, (err) => {
            if (err) {
                console.error(err);
            }
            console.info("listening at port 3000");
        });
        process.on("SIGINT", async () => {
            await server.dispose();
        });
    }

    @autobind
    public init(): Promise<void> {
        return this.browser.launch();
    }

    @autobind
    public async serve(request: Request, response: Response): Promise<void> {
        const url = request.query.url;
        const removeScript = request.query.static === "true";
        console.debug(`rendering ${removeScript ? "static" : ""} ${url}`);
        const html = removeScript ? await this.browser.renderStaticHtml(url) : await this.browser.renderHtml(url);
        response.end(html);
    }

    @autobind
    private dispose(): Promise<void> {
        console.info("closing browser");
        return this.browser.kill();
    }
}
