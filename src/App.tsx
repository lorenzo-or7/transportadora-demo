import { MotionConfig } from 'motion/react'
import { FloatingNavbar } from './components/FloatingNavbar'
import { Footer } from './components/Footer'
import { useTheme } from './lib/hooks'
import { QuoteProvider } from './lib/quote-context'
import { ContactCTA } from './sections/Contact'
import { Coverage, Technology } from './sections/Coverage'
import { Hero } from './sections/Hero'
import { Operations } from './sections/Operations'
import { Services } from './sections/Services'
import { Quote, Tracking } from './sections/Tools'
import { WhyUs } from './sections/WhyUs'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <MotionConfig reducedMotion="user">
      <QuoteProvider>
        <FloatingNavbar theme={theme} onToggleTheme={toggle} />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Hero />
          <Services />
          <Quote />
          <Tracking />
          <Coverage />
          <Operations />
          <Technology />
          <WhyUs />
          <ContactCTA />
        </main>
        <Footer />
      </QuoteProvider>
    </MotionConfig>
  )
}
