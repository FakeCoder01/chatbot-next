import { useState } from 'react';

import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { Chroma } from "langchain/vectorstores/chroma";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";


const OPENAI_API_KEY = "";

const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 });
const memory = new BufferMemory();

// const embeddings = new OpenAIEmbeddings({  
//   openAIApiKey: OPENAI_API_KEY,
// });

const chain = new ConversationChain({ llm: model, memory: memory });

async function sendMessage(text) {
  const res = await chain.call({ input: text });
  return res.response;
}




async function file_and_conversation() {
  try {
    const fileUrl = "filename.pdf";
    const saveDirectory = "faiss-data/";
    const loader = new PDFLoader(fileUrl);
    const documents = await loader.load();
    const textSplitter = new CharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 0 });
    const splitDocuments = await textSplitter.splitDocuments(documents);
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
    
    const vectorDb = await Chroma.fromDocuments(splitDocuments, embeddings);

    await vectorDb.saveLocal(saveDirectory);
    // Remove the file (you may need to use a package like 'fs' to remove the file in Node.js)
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    const response = await sendMessage(input);
    setMessages([...newMessages, { text: response, sender: 'bot' }]);
    setInput('');
    // file_and_conversation();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const response = await sendMessage(text);
      setMessages([...messages, { text: "datat", sender: 'bot' }]);
      setFile(null);
    };
    reader.readAsText(file);
  }

  return (

    <div className="container mx-auto max-w-4xl p-4">

      <div
          className="bg-gradient-to-br from-indigo-200 to-green-100 px-4 py-3 flex justify-between items-center rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-800 font-mono">Talk to PDF</h3>
          <div className="flex items-center space-x-4">
              <button className="p-2">
                  <i className="fas fa-share text-gray-600 hover:text-gray-900"></i>
              </button>
              <button className="p-2">
                  <i id="cpybtn" className="fas fa-copy text-gray-600 hover:text-gray-900"></i>
              </button>
              <button className="p-2" onclick="window.location.href='/';">
                  <i className="fas fa-times text-red-400 hover:text-red-700"></i>
              </button>
          </div>
      </div>
      <div className="bg-gray-100 p-4">
          <div className="chat-history h-[77vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index}>
                {message.sender === 'user' ? (

                  <div class="flex items-center justify-end mt-2">
                    <div class="rounded-3xl bg-indigo-400 text-white py-2 px-4 mr-2">{message.text}</div>
                    <div class="text-gray-400 text-sm font-semibold">{new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                  </div>
 
                ) : (
                    <div class="flex items-center mt-2 bot-response-copy">
                      <div class="rounded-3xl bg-gray-200 text-gray-900 py-2 px-4 ml-2 mr-2">{message.text}</div>
                      <div class="text-gray-400 text-sm font-semibold">{new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                  </div>

                )}
              </div>
            ))}
          </div>
          <div className="relative input-field">
              <form id="form" enctype="multipart/form-data" onSubmit={handleSubmit}>
                  <input type="text" name="message" id="message" onChange={(e) => setInput(e.target.value)}
                      className="bg-white rounded-full border text-slate-900 border-gray-300 focus:outline-none focus:ring focus:ring-indigo-100 py-2 pr-4 pl-12 block w-full appearance-none leading-normal"
                      placeholder="Type your message..."/>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                      <button type="submit"
                          className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-indigo-600">
                          <i className="fas fa-paper-plane"></i>
                      </button>
                  </div>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <label className="cursor-pointer mr-2" for="file_input">
                          <i id="btnIcon" className="fa-sharp fa-regular fa-file-pdf fa-xl text-[#3c3adf]"></i>
                      </label>

                      <input type="file" accept="application/pdf" onChange={handleFileChange}  name="pdf_file"
                          id="file_input"/>
                  </div>
              </form>
          </div>
      </div>
  </div>

  );
}