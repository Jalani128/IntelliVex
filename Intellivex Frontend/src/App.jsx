import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import DataScience from './pages/DataScience'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import Industries from './pages/Industries'
import IndustryDetail from './pages/IndustryDetail'
import Testimonials from './pages/Testimonials'
import ClientPortfolioDetail from './pages/ClientPortfolioDetail'
import Partnership from './pages/Partnership'
import Products from './pages/Products'
import Contact from './pages/Contact'

const App = () => (
  <>
    <ScrollManager />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/details" element={<ServiceDetail />} />
      <Route path="/services/data-science" element={<DataScience />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio/details" element={<ProjectDetail />} />
      <Route path="/portfolio/:id" element={<ProjectDetail />} />
      <Route path="/project/details" element={<ProjectDetail />} />
      <Route path="/industries" element={<Industries />} />
      <Route path="/industries/details" element={<IndustryDetail />} />
      <Route path="/industries/:slug" element={<IndustryDetail />} />
      <Route path="/industry/details" element={<IndustryDetail />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/client-portfolio/details" element={<ClientPortfolioDetail />} />
      <Route path="/client-portfolio/:slug" element={<ClientPortfolioDetail />} />
      <Route path="/portfolio/client/:slug" element={<ClientPortfolioDetail />} />
      <Route path="/portfolio/client-details" element={<ClientPortfolioDetail />} />
      <Route path="/partnerships" element={<Partnership />} />
      <Route path="/partnership" element={<Partnership />} />
      <Route path="/partnership/details" element={<Partnership />} />
      <Route path="/partnership/:slug" element={<Partnership />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/details" element={<Products />} />
      <Route path="/products/:slug" element={<Products />} />
      <Route path="/product/details" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
)

export default App
