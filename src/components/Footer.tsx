import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function Footer() {
  const { t, language } = useLanguage();
  
  // Get contact information from localStorage
  const [contactInfo, setContactInfo] = useState({
    phone: '+1 (800) 123-4567',
    email: 'contact@luxmode.com',
    address: '123 Fashion Avenue, New York, NY 10001',
    hours: 'Mon-Sun 10:00 AM - 8:00 PM'
  });
  
  useEffect(() => {
    try {
      const savedContactInfo = localStorage.getItem('contactInfo');
      if (savedContactInfo) {
        setContactInfo(JSON.parse(savedContactInfo));
      }
    } catch (error) {
      console.error('Failed to load contact information:', error);
    }
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-light tracking-wider text-[var(--color-primary)] mb-6">
              LUXMODE
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              Elevating fashion with artisanal craftsmanship and sustainable materials since 2020.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-[var(--color-accent)] transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-[var(--color-accent)] transition-colors">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-[var(--color-accent)] transition-colors">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-[var(--color-accent)] transition-colors">
                <i className="fa-brands fa-pinterest-p"></i>
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium text-[var(--color-primary)] mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Men's Collection</Link></li>
              <li><Link to="/products" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Women's Collection</Link></li>
              <li><Link to="/custom" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Custom Design</Link></li>
              <li><Link to="/wholesale" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Wholesale</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium text-[var(--color-primary)] mb-6">Help</h4>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Size Guide</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium text-[var(--color-primary)] mb-6">Stay Updated</h4>
            <p className="text-sm text-gray-600 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex mb-6">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 w-full border border-gray-300 focus:outline-none focus:border-[var(--color-accent)]"
              />
              <button className="bg-[var(--color-primary)] text-white px-4 py-2 hover:bg-[var(--color-accent)] transition-colors">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center"><i className="fa-solid fa-map-marker-alt mr-2 text-[var(--color-accent)]"></i>{contactInfo.address}</p>
              <p className="flex items-center"><i className="fa-solid fa-phone mr-2 text-[var(--color-accent)]"></i>{contactInfo.phone}</p>
              <p className="flex items-center"><i className="fa-solid fa-envelope mr-2 text-[var(--color-accent)]"></i>{contactInfo.email}</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LUXMODE. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-600">
            <Link to="/terms" className="hover:text-[var(--color-accent)] transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link>
            <Link to="/sustainability" className="hover:text-[var(--color-accent)] transition-colors">Sustainability</Link>
          </div>
        </div>
        
        {/* Payment methods */}
        <div className="mt-8 flex justify-center space-x-4">
          <i className="fa-brands fa-cc-visa text-xl text-gray-600"></i>
          <i className="fa-brands fa-cc-mastercard text-xl text-gray-600"></i>
          <i className="fa-brands fa-cc-amex text-xl text-gray-600"></i>
          <i className="fa-brands fa-paypal text-xl text-gray-600"></i>
          <i className="fa-brands fa-apple-pay text-xl text-gray-600"></i>
        </div>
      </div>
    </footer>
  );
}