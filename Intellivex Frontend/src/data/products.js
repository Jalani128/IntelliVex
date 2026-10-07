import productPlaceholder from "../assets/product1.png";
import industryIcon from "../assets/Engineering.png";

/*
 * Products page chrome. Headings, products, category pills, solution cards,
 * Use Case industries, button labels, CTA and SEO all come from the API
 * (GET /api/products-page, /api/products/{slug}) — see services/products.js.
 */
export const PRODUCTS_HEADER = {
  title: "Products",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Products" },
  ],
};

export const PRODUCT_DETAIL_HEADER = {
  title: "Product Details",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "Product Details" },
  ],
};

/* Small labels above each section's heading (the API has no eyebrow per section). */
export const SECTION_EYEBROWS = {
  featured: "LATEST WORK",
  categories: "HOW IT WORK",
  deployable: "FOCUSED",
  useCases: "FOCUSED",
  showcase: "OUR RECENT WORKS",
};

/* Shown for products without an image, and industries without an icon. */
export const PRODUCT_IMAGE_PLACEHOLDER = productPlaceholder;
export const INDUSTRY_ICON_FALLBACK = industryIcon;
