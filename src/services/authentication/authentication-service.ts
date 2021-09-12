import { inject, injectable } from "inversify";
import puppeteer from "puppeteer";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import { Settings } from "../../infrastructure/configurations/settings";
import { LoggerService } from "../logger/logger-service";
import { AuthenticationContext } from "./entities/authentication-context";

@injectable()
export class AuthenticationService {
  private readonly loggerService: LoggerService;
  private readonly settings: Settings;

  constructor(@inject(LoggerService) loggerService: LoggerService, @inject(Settings) settings: Settings) {
    this.loggerService = loggerService;
    this.settings = settings;
  }

  public async login(): Promise<Result<AuthenticationContext>> {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        // executablePath: this._options.loginOptions.browserPath,
        args: ["--start-maximized"],
      });

      const tab = await browser.newPage();

      await tab.goto("https://www.investidor.b3.com.br", { waitUntil: "networkidle0" });

      await tab?.waitForSelector("#extension_DocInput", { visible: true, timeout: 0 });

      await tab.focus("#extension_DocInput");

      await tab.keyboard.type(this.settings.username);

      await tab.click("#continue");

      await tab?.waitForSelector("#password", { visible: true, timeout: 0 });

      await tab.focus("#password");

      await tab.keyboard.type(this.settings.password);

      await tab?.waitForSelector(".saudacao", { visible: true, timeout: 0 });

      const sessionStorage = await tab.evaluate(() => {
        const json = {};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (let i = 0; i < sessionStorage.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const key = sessionStorage.key(i);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          json[key] = sessionStorage.getItem(key);
        }
        return json as { "cache-guid": string; token: string };
      });

      await browser.close();

      const authenticationContext = new AuthenticationContext(sessionStorage["cache-guid"], sessionStorage.token);

      return new ResultSuccess(authenticationContext);
    } catch (error) {
      this.loggerService.error("Fail to authenticate user", { error });

      return new ResultError("Fail to authenticate user");
    }
  }
}
