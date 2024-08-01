import React, { createContext, useEffect, useState } from "react";
import runChat from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompts, setRecentPrompts] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
setTimeout(function(){
setResultData(prev => prev+nextWord)
}, 60*index)
  }

  const onSent = async (prompt) => {
    setResultData("")
    setLoading(true)
    setShowResult(true)
    setRecentPrompts(input)
    const response = await runChat(input);
    let responseArray = response.split("**")
    let newResponse
    for(let i = 0; i < responseArray.length; i++){
      if(i === 0 || i%2 !== 1){
        newResponse += responseArray[i]

      }
      else{
        newResponse += "<b>"+responseArray[i]+"</b>"
      }
    }
    let finalResponse = newResponse.split("*").join("</br>")
    let newResponseArray = finalResponse.split(" ");
    for(let i = 0; i < newResponseArray.length; i++){
      const nextWord  = newResponseArray[i]
      delayPara(i, nextWord+" ")
    }
    setLoading(false)
    setInput("")

  };


  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompts,
    recentPrompts,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
