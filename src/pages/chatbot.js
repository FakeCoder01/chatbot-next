import { useState } from 'react';
// import { Configuration, OpenAIApi } from "openai";

import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";  
import { ChatOpenAI } from "langchain/chat_models/openai";  

// const configuration = new Configuration({
//   apiKey: "",
// });
// const client = new OpenAIApi(configuration);
const model = new OpenAI({ openAIApiKey: "", temperature: 0.9 });
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });

const embeddings = new OpenAIEmbeddings({  
  openAIApiKey: "",
});


async function sendMessage(text) {

  const res = await chain.call({ input: text });

  // const response = await client.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: text,
  //   temperature: 0.6,
  // });
  return res.response;
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
    <div>
      <div className='h-[500px] max-h-[500px] bg-blue-200 my-0 px-4 py-3 overflow-y-auto w-[800px]'>
        {messages.map((message, index) => (
          <div key={index}>
            {message.sender === 'user' ? (
              <p className='text-gray-600 py-1'>You: {message.text}</p>
            ) : (
              <p className='text-purple-800 py-1'>Bot: {message.text}</p>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className='my-2'>
        <input type="text" value={input} className='text-pink-600 text-xl px-3 py-1 w-[800px] block' onChange={(e) => setInput(e.target.value)} />
        <button type="submit" className='bg-green-500 my-3 rounded-lg px-2 py-1 text-dark'>Send</button>
        <input type="file" className='file:border file:border-solid float-right my-3' accept=".pdf" onChange={handleFileChange} />
        {file && <p>Uploading {file.name}...</p>}
      </form>
    </div>
  );
}