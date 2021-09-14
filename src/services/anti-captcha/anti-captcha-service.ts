import { AntiCaptcha, IRecaptchaV2TaskProxyless, IRecaptchaV2TaskProxylessResult, TaskTypes } from "anticaptcha";
import { inject, injectable } from "inversify";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import { LoggerService } from "../logger/logger-service";

interface AntiCaptchaServiceResolveParameters {
  serviceKey: string;
  websiteKey: string;
  websiteURL: string;
}

@injectable()
export class AntiCaptchaService {
  private readonly loggerService: LoggerService;

  constructor(@inject(LoggerService) loggerService: LoggerService) {
    this.loggerService = loggerService;
  }

  public async resolve(parameters: AntiCaptchaServiceResolveParameters): Promise<Result<string>> {
    try {
      const antiCaptcha = new AntiCaptcha(parameters.serviceKey);

      if (!(await antiCaptcha.isBalanceGreaterThan(5))) {
        this.loggerService.warn("Take care, you're running low on money!");
      }

      const taskId = await antiCaptcha.createTask<IRecaptchaV2TaskProxyless>({
        type: TaskTypes.RECAPTCHAV2_PROXYLESS,
        websiteKey: parameters.websiteKey,
        websiteURL: parameters.websiteURL,
      });

      this.loggerService.info("Calling external service to solve captcha", { parameters: taskId });

      const response = await antiCaptcha.getTaskResult<IRecaptchaV2TaskProxylessResult>(taskId);

      this.loggerService.info("Resolved captcha successfully", { parameters: taskId });

      return new ResultSuccess(response.solution.gRecaptchaResponse);
    } catch (error) {
      this.loggerService.error("Fail to resolve captcha", { error });

      return new ResultError("Fail to resolve captcha");
    }
  }
}
