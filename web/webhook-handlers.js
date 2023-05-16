import { DeliveryMethod } from "@shopify/shopify-api";


export default {

  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('--- Product update ---');
      console.log('DeliveryMethod is',DeliveryMethod);
      const payload = JSON.parse(body);
      console.log(payload);
      console.log(topic);
      console.log(shop);
      console.log(webhookId);
      console.log('--- /Product update ---');
    },
  },

  CARTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('--- Cart update ---');
      const payload = JSON.parse(body);
      console.log(topic);
      console.log(shop);
      console.log(payload);
      console.log('--- /Cart update ---');
    },
  },
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);

    },
  },
};

// export const verifyWebhook = (request) => {

//   const hmacHeader = request.headers['x-shopify-hmac-sha256'];
//   const payload = request.body;
//   const secret = process.env.SHOPIFY_API_SECRET;

//   console.log("hmacHeader : ",hmacHeader);
//   console.log("payload : ",payload);
//   console.log("hmasecretcHeader : ",secret)
//   const hmac = crypto
//     .createHmac('sha256', secret)
//     .update(payload, 'utf8')
//     .digest('base64');

//   return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(hmacHeader));
// };






