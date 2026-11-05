/*
 * Production-only deterrent against casual inspection: disables the right-click
 * menu and the usual DevTools / view-source shortcuts. Browsers always let a
 * determined visitor open DevTools (browser menu, flags, extensions), so this is a
 * speed bump, not protection — never rely on it to hide secrets.
 *
 * Form fields keep their context menu so visitors can still paste into the
 * contact form.
 */

const isEditable = (el) => el instanceof Element && Boolean(el.closest("input, textarea, [contenteditable='true']"));

function blockedShortcut(e) {
  const key = e.key.toUpperCase();
  const mod = e.ctrlKey || e.metaKey;
  if (key === "F12") return true;
  // Ctrl+Shift+I / J / C (Windows, Linux), Cmd+Option+I / J / C (Mac)
  if (mod && (e.shiftKey || e.altKey) && ["I", "J", "C"].includes(key)) return true;
  // View source: Ctrl+U / Cmd+Option+U
  if (mod && key === "U") return true;
  return false;
}

export function installInspectGuard() {
  document.addEventListener("contextmenu", (e) => {
    if (!isEditable(e.target)) e.preventDefault();
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (blockedShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
}
