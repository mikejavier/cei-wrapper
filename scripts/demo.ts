import { CeiWrapper } from "../src/cei-wrapper";

(async () => {
  const ceiWrapper = new CeiWrapper({ username: "", password: "" });

  const result = await ceiWrapper.getConsolidatedValues();

  if (result.isError) {
    console.log("We have some problem!", result);
  }

  console.log(result);
})();
