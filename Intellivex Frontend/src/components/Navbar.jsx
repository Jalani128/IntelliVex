import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import SiteLink from "./SiteLink";
import { NAV_LINKS } from "../data/home";
import { useApiData } from "../hooks/useApiData";
import { fetchMenuServices, subServiceSlug, toMenuItems } from "../services/services";
import { AI_INNOVATION_CARD, SERVICE_CATALOG, subServicesFor } from "../data/services";
import { fetchMenuIndustries, toIndustryMenuItem } from "../services/industries";
import logo from "../assets/logo.svg";


const DESKTOP_PILL = "px-3.5 min-[1400px]:px-5";

/** Built-in Services menu items get their sub-services (content file) until the API answers. */
const withMenuChildren = (item) =>
  item.children
    ? item
    : { ...item, children: subServicesFor(item.label).map((label) => ({ label, href: `${item.href}/${subServiceSlug(label)}` })) };

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

/* Icon + description per main service, as on the service cards (keyed by title).
   The cards' icons are used first: the live AI service's uploaded icon is a logo. */
const SERVICE_FACTS = Object.fromEntries(
  [AI_INNOVATION_CARD, ...SERVICE_CATALOG.items].map((c) => [
    [c.title, c.highlight].filter(Boolean).join(" ").toLowerCase(),
    { icon: c.icon, description: c.description },
  ]),
);
const withFacts = (item) => {
  const facts = SERVICE_FACTS[item.label.toLowerCase()] ?? {};
  return { ...item, icon: facts.icon || item.icon, description: item.description || facts.description };
};

/**
 * Services mega menu (desktop). Left: the main services as cards (icon, name, one-line
 * description). Right: the sub-services of the service under the pointer (or keyboard
 * focus), with its name, description and a link to its page. The first service is
 * shown when the menu opens.
 * The panel hangs from the header itself (the group around the trigger is not
 * positioned); an invisible 32px strip under "Services" (a span inside the link)
 * bridges the header's bottom padding, so the pointer never leaves the hover area.
 */
function ServicesMegaMenu({ link, active, onSelect }) {
  const items = link.dropdown.map(withFacts);
  const [current, setCurrent] = useState(0);
  const service = items[Math.min(current, items.length - 1)];

  return (
    <div className="group" onMouseLeave={() => setCurrent(0)}>
      <SiteLink
        href={link.href}
        onClick={() => onSelect(link.label)}
        aria-current={active === link.label ? "page" : undefined}
        className={`nav-pill ${DESKTOP_PILL} flex items-center gap-1.5`}
      >
        {link.label}
        <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
        <span aria-hidden="true" className="absolute inset-x-0 top-full h-8" />
      </SiteLink>

      {/* The wrapper spans the whole header but ignores the pointer, so only the card itself
          keeps the menu open — moving off its left or right edge closes it. */}
      <div className="pointer-events-none invisible absolute inset-x-0 top-full translate-y-2 px-6 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="pointer-events-auto mx-auto grid w-full max-w-[1080px] grid-cols-[340px_minmax(0,1fr)] overflow-hidden rounded-card border border-white/12 bg-navy-soft bg-card-glow shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
          {/* Main services */}
          <ul className="space-y-1 border-r border-white/10 bg-navy-deep/60 p-3">
            {items.map((item, i) => {
              const on = item === service;
              return (
                <li key={item.label}>
                  <SiteLink
                    href={item.href}
                    onClick={() => onSelect(link.label)}
                    onMouseEnter={() => setCurrent(i)}
                    onFocus={() => setCurrent(i)}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-200 ${
                      on ? "border-accent/40 bg-white/[0.06]" : "border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors duration-200 ${on ? "bg-accent-deep" : "bg-white/[0.06]"}`}>
                      {item.icon ? (
                        <img src={item.icon} alt="" aria-hidden="true" className="size-5 object-contain" />
                      ) : (
                        <span className="size-2 rounded-full bg-white/60" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[14px] font-medium leading-tight text-white">{item.label}</span>
                      {item.description && (
                        <span className="mt-0.5 block truncate font-body text-[12px] leading-snug text-white/55">{item.description}</span>
                      )}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-all duration-200 ${on ? "translate-x-0.5 text-white" : "text-white/30"}`}
                    />
                  </SiteLink>
                </li>
              );
            })}
          </ul>

          {/* Sub-services of the service under the pointer */}
          <div key={service.label} className="flex flex-col p-7">
            <p className="font-display text-[22px] font-medium leading-tight text-white">{service.label}</p>
            {service.description && (
              <p className="mt-2 max-w-[560px] font-body text-[13px] leading-[1.6] text-white/65">{service.description}</p>
            )}

            {service.children?.length > 0 && (
              <ul className="mt-5 grid grid-cols-2 gap-2">
                {service.children.map((child) => (
                  <li key={child.label}>
                    <SiteLink
                      href={child.href}
                      onClick={() => onSelect(link.label)}
                      className="group/child flex h-full items-center justify-between gap-3 rounded-lg border border-accent/50 bg-accent-deep/25 px-3.5 py-2.5 font-body text-[13px] leading-snug text-white transition-colors duration-200 hover:border-white/10 hover:bg-white/[0.03] hover:text-white/80"
                    >
                      {child.label}
                      <ChevronRight size={13} className="shrink-0 text-white transition-all duration-200 group-hover/child:translate-x-0.5 group-hover/child:text-white/30" />
                    </SiteLink>
                  </li>
                ))}
              </ul>
            )}

            <SiteLink
              href={service.href}
              onClick={() => onSelect(link.label)}
              className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 font-display text-[13px] font-medium text-accent-soft transition-colors hover:text-white"
            >
              View {service.label}
              <ChevronRight size={14} />
            </SiteLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  // Mobile sheet: which main service has its sub-services expanded.
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [active, setActive] = useState(() => linkAt(pathname, hash));
  const [scrolled, setScrolled] = useState(false);

  // Services and Industries dropdowns come from the API (show_in_menu). Services keeps its
  // built-in links until then; Industries stays a plain link when none are in the menu.
  const serviceMenu = useApiData(fetchMenuServices, toMenuItems, null);
  const industryMenu = useApiData(fetchMenuIndustries, (rows) => rows.map(toIndustryMenuItem), null);
  const links = useMemo(
    () =>
      NAV_LINKS.map((link) => {
        if (link.label === "Services") return { ...link, dropdown: (serviceMenu ?? link.dropdown).map(withMenuChildren) };
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
    setOpenSubmenu(null);
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
            link.label === "Services" && link.dropdown?.length ? (
              <ServicesMegaMenu key={link.label} link={link} active={active} onSelect={selectLink} />
            ) : link.dropdown ? (
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

                <div className="invisible absolute left-1/2 top-full w-[240px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-card border border-white/10 bg-navy-deep p-2 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
                    {link.dropdown.map((item) =>
                      item.children?.length ? (
                        /* Main service: its sub-services open in a side menu on hover. */
                        <div key={item.label} className="group/sub relative">
                          <SiteLink
                            href={item.href}
                            onClick={() => selectLink(link.label)}
                            className="flex items-center justify-between gap-3 rounded-btn px-3 py-2 font-body text-sm text-white/80 transition-colors group-hover/sub:bg-white/5 group-hover/sub:text-white"
                          >
                            {item.label}
                            <ChevronRight size={14} className="shrink-0 opacity-60 transition-transform duration-300 group-hover/sub:translate-x-0.5" />
                          </SiteLink>
                          {/* pl-3 bridges the gap so the pointer can travel into the side menu. */}
                          <div className="invisible absolute left-full top-0 w-[330px] -translate-x-1 pl-3 opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100">
                            <div className="rounded-card border border-white/10 bg-navy-deep p-2 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
                              {item.children.map((child) => (
                                <SiteLink
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => selectLink(link.label)}
                                  className="block rounded-btn px-3 py-2 font-body text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                  {child.label}
                                </SiteLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <SiteLink
                          key={item.label}
                          href={item.href}
                          className="block rounded-btn px-3 py-2 font-body text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {item.label}
                        </SiteLink>
                      ),
                    )}
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
          <Button href="/contact" variant="glow" size="sm">
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
                          {link.dropdown.map((item) =>
                            item.children?.length ? (
                              <div key={item.label}>
                                <div className="flex items-center">
                                  <SiteLink
                                    href={item.href}
                                    onClick={() => selectLink(link.label)}
                                    className="flex-1 rounded-btn px-3 py-2.5 font-body text-sm text-white/70 transition-colors hover:text-white"
                                  >
                                    {item.label}
                                  </SiteLink>
                                  <button
                                    type="button"
                                    onClick={() => setOpenSubmenu((prev) => (prev === item.label ? null : item.label))}
                                    aria-expanded={openSubmenu === item.label}
                                    aria-label={`${openSubmenu === item.label ? "Hide" : "Show"} ${item.label} sub-services`}
                                    className="grid h-9 w-9 shrink-0 place-items-center rounded-btn text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                                  >
                                    <ChevronDown
                                      size={16}
                                      className={`transition-transform duration-300 ${openSubmenu === item.label ? "rotate-180" : ""}`}
                                    />
                                  </button>
                                </div>
                                <AnimatePresence>
                                  {openSubmenu === item.label && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.25 }}
                                      className="ml-3 overflow-hidden border-l border-white/10 pl-3"
                                    >
                                      {item.children.map((child) => (
                                        <SiteLink
                                          key={child.label}
                                          href={child.href}
                                          onClick={() => selectLink(link.label)}
                                          className="block rounded-btn px-3 py-2 font-body text-[13px] text-white/60 transition-colors hover:text-white"
                                        >
                                          {child.label}
                                        </SiteLink>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <SiteLink
                                key={item.label}
                                href={item.href}
                                onClick={() => selectLink(link.label)}
                                className="block rounded-btn px-3 py-2.5 font-body text-sm text-white/70 transition-colors hover:text-white"
                              >
                                {item.label}
                              </SiteLink>
                            ),
                          )}
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
