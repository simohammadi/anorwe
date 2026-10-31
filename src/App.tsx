import { Box } from "@chakra-ui/react"
import { LogoDefs } from "@/components/Logo"
import { Stars } from "@/components/Stars"
import { Sky } from "@/components/Sky"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Story } from "@/components/Story"
import { Services } from "@/components/Services"
import { Process } from "@/components/Process"
import { Faq } from "@/components/Faq"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      <LogoDefs />
      <div className="backdrop" aria-hidden="true" />
      <Stars />
      <div className="scrim" aria-hidden="true" />
      <Sky />
      <Navbar />
      <Box as="main" position="relative" zIndex="1" overflowX="clip">
        <Hero />
        <About />
        <Story />
        <Services />
        <Process />
        <Faq />
        <Contact />
      </Box>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
