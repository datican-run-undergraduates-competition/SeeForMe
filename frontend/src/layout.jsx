import "./index.css"
import { ThemeProvider } from "../context/theme-context"

const inter = Inter({ subsets: ["latin"] })

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}