import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const DashboardSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnexion réussie");
      navigate("/");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[280px] flex flex-col border-r border-[#493622] bg-[#231a10] 
        transition-all duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:z-0
      `}>
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="flex flex-col gap-8">
            {/* Profile / Brand */}
            <div className="flex items-center justify-between px-2">
              <NavLink to="/dashboard/compte" onClick={onClose} className="flex items-center gap-3 group cursor-pointer">
                <img
                  src={profile?.image || "https://imgs.search.brave.com/SU6DjXUVoDrdq7vpMSVNfbUFdVDH5Po5Tp5hxoZmMRg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC84/Mi8wOC9tYWxlLWFu/ZC1mZW1hbGUtcHJv/ZmlsZS1zaWxob3Vl/dHRlcy12ZWN0b3It/Mzg1NzgyMDguanBn"}
                  className="rounded-full object-cover size-12 shadow-lg border-2 border-[#f27f0d] transition-transform group-hover:scale-110"
                  alt="Profile"
                />
                <div className="flex flex-col">
                  <h1 className="text-white text-lg font-bold leading-tight group-hover:text-[#f27f0d] transition-colors">Footbooking</h1>
                  <p className="text-[#cbad90] text-xs font-normal">Mon Compte</p>
                </div>
              </NavLink>
              {/* Close Button Mobile */}
              <button
                onClick={onClose}
                className="md:hidden size-8 flex items-center justify-center rounded-full bg-[#493622] text-[#cbad90] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              <NavItem to="/dashboard" icon="dashboard" label="Tableau de bord" end onClick={onClose} />
              <NavItem to="/dashboard/terrains" icon="stadium" label="Mes Terrains" onClick={onClose} />
              <NavItem to="/dashboard/reservations" icon="calendar_month" label="Mes Réservations" onClick={onClose} />
              <NavItem to="/dashboard/stats" icon="bar_chart" label="Statistiques" onClick={onClose} />
              <NavItem to="/dashboard/revenues" icon="payments" label="Revenus" onClick={onClose} />
            </nav>
          </div>

          {/* Bottom Action */}
          <div className="px-2">
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-4 border border-[#493622] hover:bg-[#2c241b] text-[#cbad90] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


const NavItem = ({ to, icon, label, end, onClick }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-full transition-all ${isActive
          ? "bg-[#f27f0d] text-[#231a10] shadow-md hover:opacity-90"
          : "text-[#cbad90] hover:bg-[#493622] hover:text-white"
        }`
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      <p className={`text-sm ${label === 'Tableau de bord' ? 'font-bold' : 'font-medium'}`}>{label}</p>
    </NavLink>
  );
};

export default DashboardSidebar;
