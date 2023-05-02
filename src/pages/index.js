import Image from 'next/image'
import { Inter } from 'next/font/google'
import Chatbot from './chatbot';

const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between px-24 py-8 ${inter.className}`}>
      <Chatbot />
    </main>
  )
}


