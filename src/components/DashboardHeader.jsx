import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ onMenuClick }) => {
    const { openCreateModal, notifications, unreadCount } = useDashboard();
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef(null);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full px-4 md:px-8 py-4 md:py-6 sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-[#493622]">
            <div className="flex items-center justify-between gap-4 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden size-10 flex items-center justify-center rounded-xl bg-[#493622] text-white hover:bg-[#5d452b] transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    <div className="flex flex-col">
                        <h2 className="text-white text-xl md:text-3xl font-black tracking-tight leading-none md:leading-tight">Vue d'ensemble</h2>
                        <p className="hidden md:block text-[#cbad90] text-sm">Bienvenue, {profile?.name || "Propriétaire"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {/* Notification Button */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            className="flex items-center justify-center size-9 md:size-10 rounded-full bg-[#493622] text-white hover:bg-[#5d452b] transition-colors relative cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 size-4 md:size-5 bg-[#f27f0d] text-[#231a10] text-[9px] md:text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#231a10]">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {/* Dropdown remains same but maybe adjust width for mobile */}
                        {showNotifs && (
                            <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-20 sm:top-full mt-3 sm:mt-3 w-auto sm:w-80 bg-[#2c241b] border border-[#493622] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                                <div className="p-4 border-b border-[#493622] flex justify-between items-center bg-[#231a10]/50">
                                    <h3 className="text-white font-bold">Notifications</h3>
                                    <span className="text-[#f27f0d] text-xs font-bold bg-[#f27f0d]/10 px-2 py-1 rounded-full">{unreadCount} nouvelles</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => {
                                                    setShowNotifs(false);
                                                    navigate('/dashboard/reservations');
                                                }}
                                                className="p-4 border-b border-[#493622]/50 hover:bg-[#342618] transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="size-2 rounded-full bg-[#f27f0d] mt-2 group-hover:scale-125 transition-transform" />
                                                    <div className="flex-1">
                                                        <p className="text-white text-sm font-bold leading-tight">{notif.title}</p>
                                                        <p className="text-[#cbad90] text-xs mt-1 line-clamp-2">{notif.message}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[#5d452b] text-[10px] font-bold uppercase">{notif.time} • {notif.date}</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${notif.status === 'Payé' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                                                                }`}>
                                                                {notif.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <span className="material-symbols-outlined text-[#493622] text-4xl mb-2">notifications_off</span>
                                            <p className="text-[#cbad90] text-sm">Aucune nouvelle notification</p>
                                        </div>
                                    )}
                                </div>
                                <div
                                    onClick={() => navigate('/dashboard/reservations')}
                                    className="p-3 text-center bg-[#231a10]/50 hover:bg-[#231a10] cursor-pointer transition-colors"
                                >
                                    <span className="text-[#f27f0d] text-xs font-bold">Voir toutes les réservations</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={openCreateModal} className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-9 md:h-10 px-4 md:px-6 bg-[#f27f0d] text-[#231a10] text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(242,127,13,0.3)] hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] transition-all">
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">add</span>
                        <span className="hidden sm:inline">Ajouter Terrain</span>
                        <span className="sm:hidden">Ajouter</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
