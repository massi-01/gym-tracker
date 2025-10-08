import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [hoverStyle, setHoverStyle] = useState({});
  const links = [
    { path: "/", label: "Home" },
    { path: "/exercises", label: "Exercises" },
    { path: "/routine", label: "Routine" },
  ];

  // Calcola la posizione della pagina attiva
  useEffect(() => {
    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      setIndicatorStyle({
        width: activeLink.offsetWidth + "px",
        left: activeLink.offsetLeft + "px",
      });
    }
  }, [location]);

  // Quando l’hover entra, muove temporaneamente la barra
  const handleMouseEnter = (e) => {
    const link = e.target;
    setHoverStyle({
      width: link.offsetWidth + "px",
      left: link.offsetLeft + "px",
    });
  };

  // Quando l’hover esce, riporta la barra alla posizione della pagina attiva
  const handleMouseLeave = () => {
    setHoverStyle({});
  };

  const finalIndicator = Object.keys(hoverStyle).length
    ? hoverStyle
    : indicatorStyle;

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Gym Tracker</h1>

        <div
          className="relative flex gap-6"
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

          {/* Barra blu animata */}
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
