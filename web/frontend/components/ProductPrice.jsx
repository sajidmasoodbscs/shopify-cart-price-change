import React, { useState, useCallback } from 'react';
import { AlphaCard,Form, FormLayout, Checkbox, TextField, Button } from '@shopify/polaris';
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";


export function ProductPrice() {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState();

  
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  
    const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleProductChange = useCallback(async(value) =>  setProduct(value), []);
  const handlePriceChange = useCallback(async(value) =>  setPrice(value), []);


  console.log("hello product",product);
  console.log("hello price",price);

  const handleSubmit = useCallback(async() => {
    // console.log("hello product on submit",product);
    // console.log("hello price on submit",price);

    const options=  {
    method:"post",
    body:JSON.stringify({
      name:product,
      price:price
    }),
    headers: { "Content-Type": "application/json" },
    }
    
    // setIsLoading(true);
    const response = await fetch("/api/product/pricechange",options);

 
    if (response.ok) {
      // await refetchProductCount();
      setToastProps({ content: "Product Price changed!" });
      console.log("Backend api called fron front ent")
    } else {
      // setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
      console.log("Backend api not called fron front ent")
    }

  
    
  },[product,price]);




  return (
    <>
          {toastMarkup}
    <AlphaCard>
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          value={product}
          onChange={handleProductChange}
          label="Name"
          type="text"
          autoComplete="product"
          helpText={
            <span>
              We’ll use this email address to inform you on future changes to Polaris.
            </span>
          }
        />
 
        <TextField
          value={price}
          onChange={handlePriceChange}
          label="Price"
          type="number"
          autoComplete="price"
          helpText={
            <span>
              We’ll use this email address to inform you on future changes to Polaris.
            </span>
          }
        />

        <Button submit>Submit</Button>
      </FormLayout>
    </Form>
    </AlphaCard>
    </>
  );
}
