import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-blue-800 to-cyan-700 text-white pt-20 pb-8 overflow-hidden">
      {/* 🌊 Top Wave SVG */}
      <div className="absolute top-0 left-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#0b3c80"
            fillOpacity="1"
            d="M0,128L60,154.7C120,181,240,235,360,250.7C480,267,600,245,720,224C840,203,960,181,1080,186.7C1200,192,1320,224,1380,240L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* ======= MAIN FOOTER CONTENT ======= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* -------- Left Section -------- */}
        <div>
          <p className="text-sm text-gray-200 leading-relaxed mb-6 ">
            Government Jobs Are A Top Choice For Indian Youth Due To Their
            Security, Good Salaries, Perks, And The Chance To Serve The Nation.
            They Are Accessible To Candidates With Qualifications Ranging From
            8th-Grade Education To Doctoral Degrees, Providing Opportunities For
            All.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 text-xl">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-md text-pink-500 hover:opacity-80 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-md text-sky-500 hover:opacity-80 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-md text-[#0077B5] hover:opacity-80 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-md text-red-600 hover:opacity-80 transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* -------- Company Section -------- */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Company</h3>
          <span className="block w-10 h-[2px] bg-yellow-400 mb-4"></span>
          <ul className="space-y-2 text-gray-200">
            <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Services</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">FAQ’s</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Contact Us</a></li>
          </ul>
        </div>

        {/* -------- Terms Section -------- */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Terms</h3>
          <span className="block w-10 h-[2px] bg-yellow-400 mb-4"></span>
          <ul className="space-y-2 text-gray-200">
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Terms And Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Terms Of Acceptable Usage
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
        

        {/* -------- Contact & Newsletter -------- */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <span className="block w-10 h-[2px] bg-yellow-400 mb-4"></span>

          <ul className="space-y-3 text-gray-200">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" /> +91 9875543210
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" /> support@example.com
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" /> Odisha, India
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-9">
            <h4 className="text-md font-semibold mb-2">Stay Connected</h4>
            <p className="text-sm mb-3 text-gray-200">
              Sign up for our newsletter and be the first to hear about offers,
              updates, and tips.
            </p>
            <div className="flex items-stretch bg-white/10 rounded-md overflow-hidden max-w-sm shadow-sm border border-white/20">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 text-gray-100 bg-transparent outline-none text-sm placeholder:text-gray-300"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-blue-400 px-5 flex items-center justify-center text-black hover:bg-blue-300 transition"
              >
                <FaEnvelope className="text-lg" />
              </button>
            </div>
          </div>
        </div>
        
      </div>

      {/* Divider Line */}
      <div className="max-w-7xl mx-auto border-t border-white/20 mt-10"></div>

      {/* Footer Bottom */}
      <div className="text-center text-sm text-gray-200 py-4">
        ©2024. All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
