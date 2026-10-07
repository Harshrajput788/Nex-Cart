import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FiArrowUp } from "react-icons/fi";

const columns = [
  {
    title: "Shop",
    links: [
      { to: "/", label: "Home" },
      { to: "/shop", label: "All products" },
      { to: "/about", label: "About us" },
      { to: "/contract", label: "Contact us" },
    ],
  },
  {
    title: "Customer service",
    links: [
      { to: "/faq", label: "FAQ" },
      { to: "/shipipnginfo", label: "Shipping info" },
      { to: "/returns", label: "Returns" },
      { to: "/privacy", label: "Privacy policy" },
    ],
  },
];

const socials = [
  { icon: FaFacebookF, label: "Facebook", href: "#", hover: "hover:bg-blue-600" },
  { icon: FaTwitter, label: "Twitter", href: "#", hover: "hover:bg-sky-500" },
  { icon: FaInstagram, label: "Instagram", href: "#", hover: "hover:bg-pink-600" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#", hover: "hover:bg-blue-700" },
];

const Footer: React.FC = () => {
  const linkClass =
    "inline-block text-sm text-gray-400 transition-all duration-200 hover:translate-x-1 hover:text-white";

  return (
    <footer className="relative mt-10 overflow-hidden bg-gray-950 text-gray-400">
      {/* soft glow, matches the promo banner on the home page */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white">
              Shop With Harsh
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Quality products, honest prices and support that actually answers.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, label, href, hover }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:text-white ${hover}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="mb-5 font-semibold text-white">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="mb-5 font-semibold text-white">Get in touch</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="tel:+15551234567"
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-blue-600">
                    <FaPhone size={14} />
                  </span>
                  +1 (555) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@shopwithharsh.com"
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-blue-600">
                    <IoMdMail size={16} />
                  </span>
                  support@shopwithharsh.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Shop With Harsh. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-white/10 transition-colors hover:bg-white/5 hover:text-white"
          >
            Back to top
            <FiArrowUp className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;