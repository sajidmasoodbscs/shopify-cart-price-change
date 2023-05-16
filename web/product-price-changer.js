import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";



const GET_PRODUCT_MUTATION = `
mutation ($title: String!) {
    productByTitle(title: $title) {
      id
      title
      description
      variants {
        id
        title
        price
        sku
      }
    }
  }
`;

export const productGet= async (session,productTitle) =>{
    
  const client = new shopify.api.clients.Graphql({ session });
  let executed=true;
  let response;
    try {
    //  const product= await client.query({
    //       data: {
    //         query: GET_PRODUCT_MUTATION,
    //         variables: {
    //             title:productTitle,
    //         },
    //       },
    //     });


 response = await client.query({
          data: `query {
            products(first: 10, query: "title:blue forest") {
              edges {
                node {
                  title
                }
              }
            }
          }`,
        });
    } catch (error) {
      executed=false;
      if (error instanceof GraphqlQueryError) {
        throw new Error(
          `${error.message}\n${JSON.stringify(error.response, null, 2)}`
        );
      } else {
        throw error;
      }
    }
return response;

  }