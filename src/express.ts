import {Chrome} from "./drivers/Chrome";
import {Server} from "./Server";
// --disable-setuid-sandbox
Server.start({
                 headless: true,
                 args: ["--disable-setuid-sandbox", "--no-sandbox"],
                 executablePath: Chrome.getChromeLocation(),
                 defaultViewport: {width: 1440, height: 718}
             }).then(() => {
    console.info("server started");
});
