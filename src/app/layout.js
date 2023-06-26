import './globals.css'
import { Roboto_Mono } from 'next/font/google'
import { Toaster } from "./Toaster";

const robotoMono = Roboto_Mono({
  weight: '400',
  subsets: ['latin']
})


export const metadata = {
  title: 'Give me an idea',
  description: 'Generate random ideas for your next project',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>" />
      </head>
      <body className={`${robotoMono.className} bg-indigo-800`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
