import crypto from 'crypto';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';


export const verify = async (hmacHeader, data) => {

const VERIFICATION_KEY = 'a7638ce1f85ad05ff83ee02179fde8f3d7a0b5deeb9daa24514a5dde6f6644c4';

    const hmac = crypto
    .createHmac('sha256', VERIFICATION_KEY)
    .update(data, 'utf8', 'hex')
    .digest('base64');

    let valid = true;


    if (hmacHeader === hmac) {
      console.log('Phew, it came from Shopify!')
    //   console.log(req.body)
    console.log("Received hmach in header :",hmacHeader);
    console.log("Generated hmach in header :",hmac)
      }else{
      console.log('Danger! Not from Shopify!')
      valid = false;

      console.log("Received hmach in header :",hmacHeader);
      console.log("Generated hmach in header :",hmac)

    }
    return valid;

  };

export const shopifyInstance=async()=>{
    const shopifySession = shopifyApi({
        // The next 4 values are typically read from environment variables for added security
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecretKey: process.env.SHOPIFY_API_SECRET,
        scopes: process.env.SCOPES,
        hostName: process.env.HOST
      });
      return shopifySession;
  }
