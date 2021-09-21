import { CeiWrapper } from "../src/cei-wrapper";

(async () => {
  const authenticateContext = await CeiWrapper.authenticateUser({
    captchaSolvingServiceKey: "KEY",
    username: "USER",
    password: "PASS",
  });

  if (authenticateContext.isError) {
    console.log("fail to authenticate user", authenticateContext);
    // {
    //   errorMessage: "Error Message";
    //   isError: true;
    //   status: 0;
    // }

    return;
  }

  console.log(authenticateContext.data);
  // const authenticateContext = {
  //   cacheId: "f8f7cac9-5b99-4160-94ae-eddd5dd2218",
  //   token: "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiZmFrZSIsIklzc3VlciI6Iklzc3VlciIsIlVzZXJuYW1lIjoiZmFrZSIsImV4cCI6MTYzMTY2NTM2MSwiaWF0IjoxNjMxNjY1MzYxfQ.WtIZtZkcnG-vtd72eAP0S9nYpOAprcg3jdoQc8xv1es",
  // };

  const ceiWrapper = new CeiWrapper(authenticateContext.data);

  const result = await ceiWrapper.getConsolidatedValues();

  if (result.isError) {
    console.log("We have some problem!", result);
    // {
    //   errorMessage: "Error Message";
    //   isError: true;
    //   status: 0;
    // }
    return;
  }

  console.log(result.data);
  // {
  //   "total": "1000.50",
  //   "values": [
  //     {
  //       "product": "Renda Variável",
  //       "totalAmount": "600.54",
  //       "percentage": "0.607"
  //     },
  //     {
  //       "product": "Tesouro Direto",
  //       "totalAmount": "300.92",
  //       "percentage": "0.393"
  //     }
  //   ]
  // }
})();
