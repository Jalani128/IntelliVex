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
import ProductDetail from './pages/ProductDetail'
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

      {/* Any other service comes from the API by slug. */}
      <Route path="/services/:slug" element={<ServiceDetail />} />
      {/* A sub-service of that service (its pills on the detail page link here). */}
      <Route path="/services/:slug/:sub" element={<ServiceDetail />} />
      <Route path="/portfolio" element={<Portfolio />} />

      {/* Projects come from the API by slug; the old static detail URLs go to the list. */}
      <Route path="/portfolio/details" element={<Navigate to="/portfolio" replace />} />
      <Route path="/portfolio/:slug" element={<ProjectDetail />} />
      <Route path="/project/details" element={<Navigate to="/portfolio" replace />} />
      {/* Industries hidden until content is ready — to re-enable, restore:
          /industries → <Industries />, /industries/:slug → <IndustryDetail />, and the nav link in data/home.js */}
      <Route path="/industries/*" element={<Navigate to="/" replace />} />
      <Route path="/industry/*" element={<Navigate to="/" replace />} />
      <Route path="/testimonials" element={<Testimonials />} />

      {/* Clients come from the API by slug; the old static detail URLs go to the Testimonials page. */}
      <Route path="/client-portfolio/details" element={<Navigate to="/testimonials" replace />} />
      <Route path="/client-portfolio/:slug" element={<ClientPortfolioDetail />} />
      <Route path="/portfolio/client/:slug" element={<ClientPortfolioDetail />} />
      <Route path="/portfolio/client-details" element={<Navigate to="/testimonials" replace />} />
      <Route path="/partnerships" element={<Partnership />} />
      <Route path="/partnership" element={<Partnership />} />
      <Route path="/partnership/details" element={<Partnership />} />
      <Route path="/partnership/:slug" element={<Partnership />} />
      {/* Products hidden until content is ready — to re-enable, restore:
          /products → <Products />, /products/:slug → <ProductDetail />, and the nav link in data/home.js */}
      <Route path="/products/*" element={<Navigate to="/" replace />} />
      <Route path="/product/*" element={<Navigate to="/" replace />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
)

export default App
