import { motion } from "framer-motion";
import { FaYoutube, FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import Reveal from "./Reveal";
import SiteLink from "./SiteLink";
import { FOOTER_LINKS } from "../data/home";
import logo from "../assets/logo.svg";

const SOCIAL_LINKS = [
  { Icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
  { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { Icon: FaXTwitter, label: "Twitter", href: "https://twitter.com" },
  { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="bg-footer-glow relative overflow-hidden bg-navy pb-8 pt-14 lg:pt-16">
      <div className="container-wide relative">
        <Reveal className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          <SiteLink href="#home">
            <img src={logo} alt="Intellivex Technologies" className="h-14 w-auto lg:h-[68px]" />
          </SiteLink>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <SiteLink
                key={link.label}
                href={link.href}
                className="font-body text-[15px] text-white transition-colors duration-300 hover:text-accent-soft"
              >
                {link.label}
              </SiteLink>
            ))}
          </nav>
        </Reveal>

        <div className="my-7 h-px w-full bg-white/15" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between"
        >
          <p className="font-body text-[14px] text-white/100">
            Intellivex @ {new Date().getFullYear()}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-0.5 hover:text-accent-soft"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}