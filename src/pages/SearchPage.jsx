import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import NavSearch from "../sections/profile/search/NavSearch";
import CardSearch from "../sections/profile/search/CardSearch";
import Pagination from "../sections/profile/search/Pagination";

const SearchPage = () => {
    return (
        <div className="bg-background-dark text-white min-h-screen flex flex-col overflow-x-hidden font-display">
            {/* Top Navigation */}
            <NavSearch/>
            {/* Main Layout */}
            <div className="flex flex-1 max-w-[1440px] mx-auto w-full mt-20">
                {/* Main Content (Results) */}
                <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col gap-6">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">Trouvez votre terrain</h1>
                            <p className="text-text-secondary text-sm">12 terrains disponibles pour <span className="text-primary font-medium">5 Octobre</span></p>
                        </div>
                        <div className="flex items-center gap-2 bg-surface-dark p-1 rounded-lg border border-surface-highlight">
                            <button className="px-3 py-1.5 rounded-md bg-white/10 text-white shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">grid_view</span>
                                <span className="text-sm font-medium hidden sm:block">Grille</span>
                            </button>
                            <button className="px-3 py-1.5 rounded-md text-text-secondary hover:text-white flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">map</span>
                                <span className="text-sm font-medium hidden sm:block">Carte</span>
                            </button>
                        </div>
                    </div>
                    {/* Results Grid */}
                    <CardSearch/>
                    {/* Pagination */}
                    <Pagination/>
                </main>
            </div>
        </div>
    );
};

export default SearchPage;
