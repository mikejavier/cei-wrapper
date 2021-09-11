import { ResultError } from "./result-error";
import { ResultSuccess } from "./result-success";

export type Result<S = undefined> = ResultSuccess<S> | ResultError;
