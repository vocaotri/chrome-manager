const puppeteer = require('puppeteer');
class Chrome {
    constructor(chrome) {
        this.browser,
            this.page,
            this.pages,
            this.chrome = chrome

    }
    async start(pathExt = "D:\\FEXT\\\extension_10_9_3_0", executablePathChrome = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe") {
        this.browser = await puppeteer.launch({
            headless: false,
            executablePath: executablePathChrome,
            defaultViewport: null,
            args: [
                `--no-sandbox`,
                `--disable-setuid-sandbox`,
                `--disable-extensions-except=${pathExt}`,
                `--load-extension=${pathExt}`,
                `--window-size=1000,1000`,
            ]
        });
        this.page = await this.browser.newPage();
        let proxys = this.chrome.proxy.split(":");
        let proxy = {
            ip: proxys[0],
            port: proxys[1],
            username: proxys[2],
            password: proxys[3]
        }
        await this.page.goto("https://www.google.com/", { waitUntil: 'networkidle2' });
        this.page.evaluate((chrome) => {
            document.getElementsByTagName("head")[0].getElementsByTagName("title")[0].innerHTML = chrome.name;
        }, this.chrome);
        const pid = this.browser.process().pid;
        require('child_process').execSync(`xdotool search --pid ${pid} set_window --name ${this.chrome.name}`);
        this.pages = await this.browser.pages();
        await this.pages[0].close();
        this.page = this.pages[2];
        await this.page.waitForSelector("body > div.modal.fade.ng-isolate-scope.in > div > div > div.modal-header.ng-scope > button > span:nth-child(1)");
        await this.page.click("body > div.modal.fade.ng-isolate-scope.in > div > div > div.modal-header.ng-scope > button > span:nth-child(1)");
        await this.page.evaluate(() => {
            window.location.href = "/options.html#!/profile/proxy";
        });
        await this.page.waitForSelector("body > div.container-fluid > main > div:nth-child(3) > div > section.settings-group.settings-group-fixed-servers > div > table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > input")
        await this.page.evaluate((proxy) => {
            document.querySelector("body > div.container-fluid > main > div:nth-child(3) > div > section.settings-group.settings-group-fixed-servers > div > table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > input").value = proxy.ip;
            document.querySelector("body > div.container-fluid > main > div:nth-child(3) > div > section.settings-group.settings-group-fixed-servers > div > table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > input").value = proxy.port;
            document.querySelector("body > div.container-fluid > main > div:nth-child(3) > div > section.settings-group.settings-group-fixed-servers > div > table > tbody:nth-child(2) > tr:nth-child(1) > td.proxy-actions > button").click();
        },proxy);
        await this.page.waitForSelector("body > div.modal.fade.ng-isolate-scope.in > div > div > form > div.modal-body > div:nth-child(2) > div > div > input");
        await this.page.type("body > div.modal.fade.ng-isolate-scope.in > div > div > form > div.modal-body > div:nth-child(2) > div > div > input", proxy.username);
        await this.page.type("body > div.modal.fade.ng-isolate-scope.in > div > div > form > div.modal-body > div:nth-child(3) > div > input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty", proxy.password);
        await this.page.click("body > div.modal.fade.ng-isolate-scope.in > div > div > form > div.modal-footer > button.btn.btn-primary.ng-binding")
        
        await this.page.evaluate(() => {
            document.querySelector("body > div.container-fluid > header > nav > li:nth-child(12) > a").click()
        });
        this.page.waitFor(300);
        this.page.close();
        return true;
    }
    async closeBrowser() {
        await this.browser.close();
        return true;
    }
    async disconnected(disconnected) {
        this.browser.on('disconnected', disconnected);
    }

}
module.exports.Chrome = Chrome;