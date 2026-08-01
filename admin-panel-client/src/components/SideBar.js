import { Link } from "react-router-dom";
import { Image, Send, Folder, Palette, HelpCircle, X } from "lucide-react";
import logo from "../assets/Logo.svg";

const navItems = [
  { label: "Gallery", icon: Image, href: "/admin-panel/gallery" },
  { label: "Contact Us", icon: Send, href: "/admin-panel/contacts" },
  { label: "Blogs", icon: Folder, href: "/admin-panel/blogs" },
  { label: "Custom Orders", icon: Palette, href: "/admin-panel/orders" },
  { label: "Enquiries", icon: HelpCircle, href: "/admin-panel/enquiries" },
];

const Sidebar = ({ activePath = "/dashboard", isOpen, onClose }) => {
  const isActive = (href) => {
    // Check if the activePath starts with the href
    // This handles both /admin-panel/gallery and /admin-panel/gallery/add
    return activePath === href || activePath.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile overlay — above the header (z-40) so the dimmed backdrop
          covers it too, but below the drawer itself */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[45] bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel — z-50 so it sits in front of the header (z-40)
          on mobile/tablet instead of sliding in behind it */}
      <aside
        className={[
          "fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0B1A35] flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo + close button (mobile/tablet only) */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
          <img src={logo} alt="Chettinad Handi Crafts" className="h-16 w-auto" />
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex-shrink-0"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                to={href}
                onClick={() => onClose?.()}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-[#E29C15] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;