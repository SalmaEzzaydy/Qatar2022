import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Translator.css';
import { AiOutlineClose } from 'react-icons/ai';
const Translator=()=>{

  const [inputText, setInputText] = useState('');
  const [outputLang, setOutputLang] = useState('ar');
  const [outputText, setOutputText] = useState('');
  const [isTranslated, setIsTranslated] = useState();
  const [languagesList, setLanguagesList] = useState([])

  useEffect(() => {
    axios.get(`https://libretranslate.com/languages`)
        .then((response) => {
            setLanguagesList(response.data)
        })
}, [])

  const translate = () => {
    console.log(outputLang);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.REACT_APP_RapidAPI_Key,
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
      },
      body: `[{"Text":"${inputText}"}]`
    };
    console.log(inputText);
    fetch(`${process.env.REACT_APP_Base_URL}${outputLang}${process.env.REACT_APP_Qyery_Params}`, options)
      .then(response => {
        if (response.status !== 200) {
          setIsTranslated(false);
          console.log("there's an error");
          return;
        }
        setIsTranslated(true);
        response.json()
          .then(response => {
            const translatedText = response[0].translations[0].text;
            setOutputText(translatedText);
            console.log(translatedText);
          })
      })
      .catch(err => {
        setIsTranslated(false);
        console.error(err)
      });
  }

  const clearInput = () => {
    setInputText('');
    setOutputText('');
    setIsTranslated();
  }

  return (
    <section className="translator">
      <div className="row-wrapper">
        <div className="translator-container input-lang">
          <div className="top-row">
            
          </div>
          
          <form className="input-form">
            <textarea
              className="text-box"
              placeholder="Enter text (any language)"
              onChange={e => setInputText(e.target.value)}
              value={inputText}
            >
            </textarea>
            {
              inputText !== "" &&
              <AiOutlineClose
                className="icon-btn close-btn"
                onClick={clearInput}
              />
            }
          </form>
        </div>
        <div className="translator-container output-lang">
          <div className="top-row">
          <button
              className="btn"
              onClick={translate}
            >
              Translate
            </button>
          <select  
            name="languages"
            id="languages"
            className="form-select form-select-sm " onChange={e => setOutputLang(e.target.value)}
            >
              <option>Select a Language..</option>
                {languagesList.map((language) => {
                    return (
                      <option value={language.code}>
                          {language.name}
                      </option>
                        )
                    })}
          </select>
          </div>
          <p className="text-box output-box">
            {
              isTranslated === false ?
                <span className="output-placeholder translation-error">Translation failed</span>
                :
                outputText === "" ?
                  <span className="output-placeholder">Select a language</span>
                  :
                  outputText
            }
          </p>
        </div>
      </div>
    </section>
  );
}

export default Translator;