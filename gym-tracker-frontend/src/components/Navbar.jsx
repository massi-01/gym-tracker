import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/images/logo-white-no-bg.png";

function Navbar() {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [hoverStyle, setHoverStyle] = useState({});
  const links = [
    { path: "/", label: "Home" },
    { path: "/exercises", label: "Exercises" },
    { path: "/routine", label: "Routine" },
  ];

  // Funzione per aggiornare posizione e larghezza barra blu
  const updateIndicator = () => {
    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      setIndicatorStyle({
        width: activeLink.offsetWidth + "px",
        left: activeLink.offsetLeft + "px",
      });
    }
  };

  useEffect(() => {
    updateIndicator(); // calcola all’inizio
    window.addEventListener("resize", updateIndicator); // ricalcola al resize
    return () => window.removeEventListener("resize", updateIndicator);
  }, [location]);

  const handleMouseEnter = (e) => {
    const link = e.target;
    setHoverStyle({
      width: link.offsetWidth + "px",
      left: link.offsetLeft + "px",
    });
  };

  const handleMouseLeave = () => {
    setHoverStyle({});
  };

  const finalIndicator = Object.keys(hoverStyle).length
    ? hoverStyle
    : indicatorStyle;

  return (
    <nav className="bg-gray-800 text-white shadow-md h-32 sm:h-16">
      <div className="container mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center h-full px-4">
        {/* Logo */}
        <div className="flex justify-center sm:justify-start items-center h-full">
          <img src={logo} alt="Logo" className="max-h-16 sm:max-h-16 w-auto" />
        </div>

        {/* Link pagine */}
        <div
          className="flex gap-6 items-center relative mt-2 sm:mt-0 pb-2 sm:pb-0 mb-2 sm:mb-0"
          onMouseLeave={handleMouseLeave}
        >
          {links.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `nav-link relative pb-1 transition-all duration-200 ${
                  isActive ? "active" : ""
                }`
              }
              onMouseEnter={handleMouseEnter}
            >
              {label}
            </NavLink>
          ))}

          {/* Barra blu */}
          <span
            className="absolute bottom-0 h-[3px] bg-blue-500 transition-all duration-300"
            style={finalIndicator}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
