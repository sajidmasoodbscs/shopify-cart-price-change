import crypto from 'crypto';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import { PriceChangeDB } from "./price-change-db.js";
import {
  getShopUrlFromSession,
} from "./helper/price-change-helper.js";

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


export const getSaveAccessToken= async (req,res)=>{
    // console.log("code on app instalation => ",req.query.code);
    // console.log("session on app instalation => ",res.locals.shopify.session);
    let processed =true;

    const accessToken=res.locals.shopify.session.accessToken;
    try {
      // await PriceChangeDB.deletebyShop(await getShopUrlFromSession(req, res));
      const shopFromDb=await PriceChangeDB.byShop(await getShopUrlFromSession(req, res));
      console.log("Shop exsist in database and shop is :=>",shopFromDb);
      if(shopFromDb){
        console.log("As printed above shops exsist so we are insde condition.");

        const shopId=shopFromDb.id;
        console.log("Shop is :=>",shopId);
        const updateProduct=await PriceChangeDB.update(shopId,{access_token:accessToken,});
        console.log("Shop is already exsist so its token is updated and here it is :=>",updateProduct);
        const allShops=await PriceChangeDB.list();
        console.log("All shops and accessTokens in database are :=>",allShops);
      }
       else{  
        const id = await PriceChangeDB.create({access_token:accessToken,shopDomain: await getShopUrlFromSession(req, res),});
        const response = await PriceChangeDB.read(id);
        console.log("new shop and accessToken added in database is :=>",response);
        const allShops=await PriceChangeDB.list();
        console.log("All shops and accessTokens in database are :=>",allShops);
      }
           
    } catch (error) {
      processed=false;
      console.log("Error in database function execution :=> ",error.message);
    }
    return processed;
    // next();
  }