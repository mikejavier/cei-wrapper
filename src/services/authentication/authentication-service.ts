import { inject, injectable } from "inversify";
import puppeteer from "puppeteer";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import { AntiCaptchaService } from "../anti-captcha/anti-captcha-service";
import { LoggerService } from "../logger/logger-service";
import { AuthenticationContext } from "./entities/authentication-context";
import { LoginParameters } from "./entities/login-parameters";

@injectable()
export class AuthenticationService {
  private readonly antiCaptchaService: AntiCaptchaService;
  private readonly loggerService: LoggerService;

  constructor(
    @inject(AntiCaptchaService) antiCaptchaService: AntiCaptchaService,
    @inject(LoggerService) loggerService: LoggerService,
  ) {
    this.antiCaptchaService = antiCaptchaService;
    this.loggerService = loggerService;
  }

  public async login(parameters: LoginParameters): Promise<Result<AuthenticationContext>> {
    try {
      const browser = await puppeteer.launch();

      const tab = await browser.newPage();

      await tab.goto("https://www.investidor.b3.com.br", { waitUntil: "networkidle0" });

      await tab?.waitForSelector("#extension_DocInput", { visible: true, timeout: 0 });

      await tab.focus("#extension_DocInput");

      await tab.keyboard.type(parameters.username);

      await tab.click("#continue");

      await tab?.waitForSelector("#password", { visible: true, timeout: 0 });

      await tab.focus("#password");

      await tab.keyboard.type(parameters.password);

      await tab?.waitForSelector("#divCaptcha", { visible: true, timeout: 0 });

      const websiteKey = (await tab.$eval(
        "#divCaptcha",
        (el) => el.attributes["data-sitekey"].value,
      )) as unknown as string;

      const websiteURL = tab.url();

      const anticaptchaServiceresult = await this.antiCaptchaService.resolve({
        serviceKey: parameters.anticaptchaServiceKey,
        websiteKey,
        websiteURL,
      });

      if (anticaptchaServiceresult.isError) {
        this.loggerService.error("Can't resolve captcha", { error: anticaptchaServiceresult });

        return anticaptchaServiceresult;
      }

      await tab?.waitForSelector("#g-recaptcha-response-toms", { timeout: 0 });

      await tab.$eval(
        "#g-recaptcha-response-toms",
        (el, token) => {
          el.value = token;
        },
        anticaptchaServiceresult.data,
      );

      await tab.$eval("#continue", (el) => {
        el.removeAttribute("disabled");
        el.click();
      });

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
