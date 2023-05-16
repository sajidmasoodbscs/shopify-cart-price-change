const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');
const Koa = require('koa');
const Router = require('koa-router');

const server = new Koa();
const router = new Router();

// Register webhook
const registerWebhook = async () => {
  try {
    const webhook = await Shopify.Webhook.create({
      topic: 'PRODUCTS_UPDATE',
      address: `${process.env.HOST}/api/webhooks/products-update`,
      format: 'json',
    });

    console.log(`Webhook successfully registered: ${webhook.id}`);
  } catch (error) {
    console.error(`Failed to register webhook: ${error}`);
  }
};

// Shopify auth middleware
server.use(
  createShopifyAuth({
    // ...
  }),
);

// Verify webhook requests
server.use(
  verifyRequest({
    // ...
  }),
);

// Webhook callback
router.post('/api/webhooks/products-update', async (ctx) => {
  console.log('--- Product update webhook ---');
  console.log(ctx.request.body);
  console.log('--- /Product update webhook ---');
});

server.use(router.allowedMethods());
server.use(router.routes());

// Start server and register webhook
const startServer = async () => {
  await registerWebhook();
  server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
};

startServer();


import { Shopify } from "@shopify/shopify-api";

export const registerWebhook = async () => {
  try {

    // Session is built by the OAuth process

const webhook = new Shopify.rest.Webhook({session: session});
webhook.address = `${process.env.HOST}/api/webhooks/products-update`,
webhook.topic = "products/update";
webhook.format = "json";
await webhook.save({
  update: true,
});

    // const webhook = await Shopify.Webhook.create({
    //   topic: 'PRODUCTS_UPDATE',
    //   address: `${process.env.HOST}/api/webhooks/products-update`,
    //   format: 'json',
    // });

    console.log(`Webhook successfully registered: ${webhook.id}`);
  } catch (error) {
    console.log("what is in Shopify",Shopify)
    console.error(`Failed to register webhook: ${error}`);
  }
};

export const updateWebhookUrl = async () => {
  try {
    // const webhooks = await Shopify.Webhook.list();
   const webhooks=  await Shopify.rest.Webhook.all({session: session,});

    // Session is built by the OAuth process



    for (const webhook of webhooks) {
      if (webhook.topic === 'products/update' && webhook.address === `${process.env.HOST}/api/webhooks/products-update`) {
        const updatedWebhook = await Shopify.rest.Webhook.update(webhook.id, {
          address: `${process.env.HOST}/api/webhooks/products-update`,
        });

        console.log(`Webhook URL updated: ${updatedWebhook.id}`);
      }
    }
  } catch (error) {
    console.error(`Failed to update webhook URL: ${error}`);
  }
};

