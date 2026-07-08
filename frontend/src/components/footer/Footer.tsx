import React from 'react';
import { FaFacebookF,FaTwitter,FaInstagram,FaLinkedin,FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";


const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-600 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm text-gray-400">
              Your trusted e-commerce platform for quality products and exceptional customer service.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">Shop</a></li>
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="/shipipnginfo" className="hover:text-white transition">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-white transition">Returns</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FaPhone size={16} /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <IoMdMail size={16} /> support@shopwithharsh.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 py-8">
          <div className="flex justify-center gap-4 mb-6">
            <a href="#" className="bg-gray-800 p-2 rounded hover:bg-blue-600 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded hover:bg-blue-400 transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded hover:bg-pink-600 transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded hover:bg-blue-700 transition">
              <FaLinkedin size={20} />
            </a>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 Shop With Harsh. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;