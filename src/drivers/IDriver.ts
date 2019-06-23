export interface IDriver {
    launch(): Promise<void>;
    renderHtml(url: string): Promise<string>;
    renderStaticHtml(url: string): Promise<string>;
    kill(): Promise<void>;
    renderPdf(url: string): Promise<Buffer>;
}
