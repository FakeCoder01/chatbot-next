import Image from 'next/image'
import { Inter } from 'next/font/google'
import Chatbot from './chatbot';

const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  return (
    <main className={`bg-gradient-to-br from-indigo-300 to-green-300 ${inter.className}`}>
      <Chatbot />
    </main>
  )
}


