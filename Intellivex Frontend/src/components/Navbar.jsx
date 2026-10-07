import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import SiteLink from "./SiteLink";
import { NAV_LINKS } from "../data/home";
import { useApiData } from "../hooks/useApiData";
import { fetchMenuServices, toMenuItems } from "../services/services";
import { fetchMenuIndustries, toIndustryMenuItem } from "../services/industries";
import logo from "../assets/logo.svg";


const DESKTOP_PILL = "px-3.5 min-[1400px]:px-5";

const linkAt = (pathname, hash) =>
  NAV_LINKS.find(
    (link) =>
      link.href.startsWith("/") &&
      (pathname === link.href ||
        pathname.startsWith(`${link.href}/`) ||
        (link.href === "/partnerships" && pathname.startsWith("/partnership")))
  )?.label ??
  NAV_LINKS.find((link) => link.href === hash)?.label ??
  "Home";

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [active, setActive] = useState(() => linkAt(pathname, hash));
  const [scrolled, setScrolled] = useState(false);

  // Services and Industries dropdowns come from the API (show_in_menu). Services keeps its
  // built-in links until then; Industries stays a plain link when none are in the menu.
  const serviceMenu = useApiData(fetchMenuServices, toMenuItems, null);
  const industryMenu = useApiData(fetchMenuIndustries, (rows) => rows.map(toIndustryMenuItem), null);
  const links = useMemo(
    () =>
      NAV_LINKS.map((link) => {
        if (link.label === "Services" && serviceMenu) return { ...link, dropdown: serviceMenu };
        if (link.label === "Industries" && industryMenu) return { ...link, dropdown: industryMenu };
        return link;
      }),
    [serviceMenu, industryMenu],
  );

  useEffect(() => {
    setActive(linkAt(pathname, hash));
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Stop the page scrolling behind the mobile sheet. */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const selectLink = (label) => {
    setActive(label);
    setIsOpen(false);
    setOpenDropdown(null);
  };

  /* The lit state is driven off aria-current, so the pill and the a11y
     announcement can never disagree. */
  const linkClasses = () => "nav-pill";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/95 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur" : "py-5"
      }`}
    >
      {/* Wide screens keep the flush, edge-aligned bar; narrower ones keep the container gutter
          so the logo isn't clipped and the menu button stays on screen. */}
      <div className="container-wide flex items-center justify-between gap-4 min-[1280px]:gap-6 min-[1400px]:gap-20 min-[1400px]:px-0">
        <SiteLink href="#home" className="shrink-0" onClick={() => selectLink("Home")}>
          <img src={logo} alt="Intellivex Technologies" className="h-9 w-auto min-[1400px]:ml-[-15px]" />
        </SiteLink>

        {/* Desktop navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {links.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="group relative">
                <SiteLink
                  href={link.href}
                  onClick={() => selectLink(link.label)}
                  aria-current={active === link.label ? "page" : undefined}
                  className={`${linkClasses()} ${DESKTOP_PILL} flex items-center gap-1.5`}
                >
                  {link.label}
                  <ChevronDown
                    size={12}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </SiteLink>

                <div className="invisible absolute left-1/2 top-full w-[220px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-card border border-white/10 bg-navy-deep p-2 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
                    {link.dropdown.map((item) => (
                      <SiteLink
                        key={item.label}
                        href={item.href}
                        className="block rounded-btn px-3 py-2 font-body text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {item.label}
                      </SiteLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <SiteLink
                key={link.label}
                href={link.href}
                onClick={() => selectLink(link.label)}
                aria-current={active === link.label ? "page" : undefined}
                className={`${linkClasses()} ${DESKTOP_PILL}`}
              >
                {link.label}
              </SiteLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/contact" variant="light" size="sm">
            Contact
          </Button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            className="grid h-10 w-10 place-items-center rounded-btn border border-white/20 text-white transition-colors hover:bg-white/10 xl:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-navy-deep xl:hidden"
          >
            <div className="container-wide flex max-h-[75vh] flex-col gap-1 overflow-y-auto py-4">
              {links.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) => (prev === link.label ? null : link.label))
                      }
                      aria-current={active === link.label ? "true" : undefined}
                      className={`${linkClasses()} flex w-full items-center justify-between`}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden pl-4"
                        >
                          {link.dropdown.map((item) => (
                            <SiteLink
                              key={item.label}
                              href={item.href}
                              onClick={() => selectLink(link.label)}
                              className="block rounded-btn px-3 py-2.5 font-body text-sm text-white/70 transition-colors hover:text-white"
                            >
                              {item.label}
                            </SiteLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <SiteLink
                    key={link.label}
                    href={link.href}
                    onClick={() => selectLink(link.label)}
                    aria-current={active === link.label ? "page" : undefined}
                    className={`${linkClasses()} block`}
                  >
                    {link.label}
                  </SiteLink>
                )
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
