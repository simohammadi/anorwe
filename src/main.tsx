import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "@/components/ui/provider"
import { staticMode } from "@/lib/sky"
import App from "./App.tsx"
import "./index.css"

if (staticMode) document.documentElement.classList.add("static")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
