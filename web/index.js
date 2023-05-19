// @ts-check
import '@shopify/shopify-api/adapters/node';
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cors from "cors"
import serveStatic from "serve-static";
import bodyParser from "body-parser";

import 'isomorphic-fetch';

import shopify from "./shopify.js";
import webhookHandlers from "./webhook-handlers.js";
import { verify,shopifyInstance } from './verifyWebhook.js';

import productCreator from "./product-creator.js";
import {productGet} from "./product-price-changer.js";
import {getSessionFromDB} from "./helper/price-change-helper.js";
import {getSaveAccessToken} from "./verifyWebhook.js"



const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(
      bodyParser.json({
        verify: (req, res, buf) => {
        req.rawBody = buf; 
        },
      })
    );

app.use(express.json());
app.use(cors());



// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post( 
  shopify.config.webhooks.path, 
  shopify.processWebhooks({webhookHandlers:webhookHandlers}) 
);

app.use("/api/*", shopify.validateAuthenticatedSession());


// app.post(
//   shopify.config.webhooks.path,
//   shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
// );





// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js





app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  console.log("session from front end:",res.locals.shopify.session)
  res.status(200).send(countData);
  // console.log("App password is . :",process.env);

  console.log("Product count is :",countData);
  // console.log("Shopify Object is =>  ::::",shopify);
  console.log("BACKEND_PORT is :",process.env.BACKEND_PORT);
  console.log("HOST is :",process.env.HOST);
  console.log("PORT is :",process.env.PORT);
  console.log("SHOPIFY_API_KEY is :",process.env.SHOPIFY_API_KEY);
  console.log("SHOPIFY_API_SECRET env is :",process.env.SHOPIFY_API_SECRET);
  // console.log("Database :",shopify.sessionStorage);

});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
    
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});


app.post("/api/product/pricechange", async (req, res) => {

  let status = 200;
  let error = null;

console.log("Reqesut from front end", req.body);
console.log("Response from front end", res.locals)

  try {
    
    const shopName= res.locals.shopify.session.shop
  
    
    const name="sajid";
    const age=27;
  const xyz=await getSaveAccessToken(name);
  console.log("Datase base execution  response:",xyz);

  // const dbRes=await getSessionFromDB(shopName);
  // console.log("Datase base execution response:",dbRes);
  // const getResponse=  await productGet(res.locals.shopify.session,req.body.name);
  // console.log("getResponse :=>",JSON.stringify(getResponse.body));
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
    // res.status(status).send({ success:"Api call success" });

});

// app.post('/webhooks/cart/update', async(req, res) => {

//   // const sessionId = await shopify.session.getCurrentId({
//   //   isOnline: true,
//   //   rawRequest: req,
//   //   rawResponse: res,
//   // });
//   // const session = await getSessionFromStorage(sessionId);

//   // console.log("session =>", session);


// console.log("Req from webhook : ",req);

//   const hmacHeader  = req.get('X-Shopify-Hmac-Sha256')
//   const data = req.rawBody

//   const verified = await verify(
//     hmacHeader,
//     data    // takes the raw body extracted before bodyparsing
//   );

//   console.log("verified :=> ",verified)

// if (verified) {
//   console.log("Webhook call is authenticated")
//  if (req.body.line_items.length!=0) {

//   const shopifyInstanceObject=await shopifyInstance();
//   console.log("shopify Instance is here :",shopifyInstanceObject.session.customAppSession);

// try {
//  if (shopifyInstanceObject){
//   const product=await shopify.api.rest.Product.find({
//     session: shopifyInstanceObject.session,
//     id: req.body.line_items.id,
//   });
//  }
//  else{
//   console.log("shopify Instance Object is not created.");
//  }
//  res.sendStatus(200).send('Api Called successfully but Admin Api not called ');
// } 
// catch (error) {
//     console.log("Error is here :",error)
//     res.sendStatus(500);
//   } 

// }
// else{
//   console.log("Cart is empty")
// }

// } else {
//     // The webhook call is not authenticated
//     res.sendStatus(401);
//     console.log("Webhook call not authenticated")
  
// }
  

//   // const callbackResponse = await shopify.api.auth.callback({
//   //   rawRequest: _req,
//   //   rawResponse: res,
//   // });
//   // console.log("Session form callbackResponse :",callbackResponse);

//   // const shopifySession = new ShopifyClient({
//   //   shopName: "integriti-group-inc-test.myshopify.com",
//   //   apiKey: process.env.SHOPIFY_API_KEY,
//   //   password: process.env.SHOPIFY_API_SECRET
//   // });

//   // shopifySession
//   // .request({
//   //   method: 'GET',
//   //   path: '/admin/api/2021-07/session.json'
//   // })
//   // .then((session) => {
//   //   console.log("Session from shopify api is : ",session);
//   // })
//   // .catch((err) => {
//   //   console.error("Error from shopify api is",err);
//   // });
//   // console.log("Cart update webhook called and response is :",res.locals.shopify)
//   console.log('🎉 Cart updated and cart is below!');
//   console.log('زody from webhook is',req.body.line_items);
//   console.log('اeaders from webhook is',req.headers);
// //   console.log("Api's :",shopify.api.rest.Product)

// });

// router.post('/webhooks/app/uninstalled',validateWebhook, appcontroller.uninstalled);


app.use(shopify.cspHeaders());





app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT,() => {
  console.log(`App listening on port ${PORT}`)
});

