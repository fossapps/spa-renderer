import {platform} from "os";
import {Browser, launch, LaunchOptions, Page} from "puppeteer-core";
import {IDriver} from "./IDriver";
export class Chrome implements IDriver {
    private browser!: Browser | null;

    constructor(private options: LaunchOptions) {
    }

    public static getChromeLocation(): string {
        const os = platform();
        switch (os) {
            case "linux":
                return "/usr/bin/chromium-browser";
                // return "/usr/bin/google-chrome";
            case "win32":
                return "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";
            case "darwin":
                return "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome";
            default:
                throw new Error(`OS Platform not supported, expected "linux", "darwin" or "win32", got ${os} instead`);
        }
    }

    public async launch(): Promise<void> {
        this.browser = await launch(this.options);
        this.browser.on("disconnected", () => {
            console.info("browser closed");
            this.browser = null;
        });
    }

    public async kill(): Promise<void> {
        if (!this.browser) {
            return;
        }
        await this.browser.close();
    }

    public async renderHtml(url: string): Promise<string> {
        const page = await this.visit(url);
        const content = await page.evaluate(() => {
            // @ts-ignore this function is run in the browser with dom context
            return document.documentElement.innerHTML;
        });
        await page.close();
        return content;
    }
    public async renderStaticHtml(url: string): Promise<string> {
        const page = await this.visit(url);
        const content = await page.evaluate(() => {
            // script is actually HTMLScriptElement but we're disabling the dom context for this project because it's mostly nodejs
            // except for this function, so any is fine
            // @ts-ignore this function is run in the browser with dom context
            Array.from(document.getElementsByTagName("script")).forEach((script: any) => {
                script.parentNode!.removeChild(script);
            });
            // @ts-ignore this function is run in the browser with dom context
            return document.documentElement.innerHTML;
        });
        await page.close();
        return content;
    }

    public async renderPdf(url: string): Promise<Buffer> {
        const page = await this.visit(url);
        return page.pdf();
    }

    private async visit(url: string): Promise<Page> {
        await this.ensureLaunched();
        const page = await this.browser!.newPage();
        await page.goto(url, {waitUntil: "networkidle2"});
        return page;
    }
    private async ensureLaunched(): Promise<void> {
        if (this.browser === null) {
            return this.launch();
        }
        return;
    }
}
