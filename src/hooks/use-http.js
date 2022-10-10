import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        requestConfig.url, {      //requestConfig is an object that have the url property
            method: requestConfig.method ? requestConfig.method : 'GET',//line 11 to 17 we send request
            headers: requestConfig.headers ? requestConfig.headers : {},
            body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        }    
      );

      if (!response.ok) {                   //here we check response
        throw new Error('Request failed!');
      }

      const data = await response.json();   //we transform the response in JSON
      applyData(data);
      
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  return {               //if the property and value names are same then we can simply write like that instead of
      isLoading,         // isLoading: isLoading,
      error,             // error: error,
      sendRequest,        // sendRequest: sendRequest
  };                    //this is modern javascript shortcut
};

export default useHttp;

//this custom hook should not only dealing with fatching data/tasks specificly
//but this hook should be able to send any kind of req to any kind of url & do any kind of data transformation
//but it should always manage the same state,loading and error & execute thesame steps in the same order
//that's the actual reusage we want here
//to configure this hook we will need some parameters (line 3) requestConfig
//what should be configurable here? the request logic (the url) & also the method,body,headers (this all needs to be flexible)
//requestConfig in turn should be an object which contains the url & any kind of other configration that might be needed
//so we get rid of that url of firebase & refer requestConfig.url
//this hook also use for POST request so the fetch should take a second argument (line 12)
//then there we pass an object where the method should be set to requestConfig.method and so on....
//lets have 2nd parameter applyData function (line 3)
//then in line 24 once we get the data we simply call applyData(data) & pass data to it
//so in the hook we just hand data of to this applyData function & the function itself
//what happen in the function is provided by component that uses this custom hook
//so we have that reusability logic in this hook
//but the specific steps that should be taken with the data in the component that uses the hook
//so isLoading, error & sendRequest are the things that we need in the component while using this hook
//that component should have access to the isLoading & error states & sendRequest function
//so that is the component which can trigger the sendRequest
//so at the end of custom hook we return the object (line 31)
//now we import the custom hook in App component
//line 11 to 17 if there is if requestConfig method is set ? we apply it otherwise it GET by default
//same logic for headers & body
//requestConfig, applyData we have now pass in sendRequest so we dont have any dependancy in line 30 when we useCallback
