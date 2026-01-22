import { Link } from "react-router";

const SearchPage = () => {
    return (
        <div className="bg-background-dark text-white min-h-screen flex flex-col overflow-x-hidden font-display">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-surface-highlight px-4 lg:px-10 py-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined text-4xl">sports_soccer</span>
                        </div>
                        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">Dakar Foot</h2>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-center gap-8">
                        <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Rechercher</a>
                        <a className="text-text-secondary text-sm font-medium leading-normal hover:text-white transition-colors" href="#">Mes Réservations</a>
                        <a className="text-text-secondary text-sm font-medium leading-normal hover:text-white transition-colors" href="#">Devenir Partenaire</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/auth/login" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-orange-600 transition-colors text-background-dark text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Connexion</span>
                        </Link>
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-dark"
                            data-alt="User profile avatar showing a smiling person"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBdJyWt6KYLxUW18PxDybaPnYFQpsJrnXs29RH-Yjla5XXFbCa2a88Mr74ljGOR6_MAMJp5hDAenWB2pg_pFvFmtCf3yS5bttebeUmIJ46QYZZ16U6_0MfLsEPkWFGhwhu0rJqHHDXrEvzkwpmKmFGK8RH9Xt36a7uKyOrUtVEz_9RsBgST1SVrmN5QQUY7tM4vbvRfC1vynGbVZAiTlwpBjK9b99AgzZ4GIJc_cP8YbQhKNzLwOFk7jUTPvT8ZHh4VhI26lwVqw")' }}
                        ></div>
                        <button className="md:hidden text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 max-w-[1440px] mx-auto w-full">
                {/* Sidebar Filters (Desktop) */}
                <aside className="hidden lg:flex flex-col w-[340px] shrink-0 border-r border-surface-highlight p-6 gap-8 h-[calc(100vh-65px)] overflow-y-auto sticky top-[65px]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Filtres</h3>
                        <button className="text-sm text-primary font-medium hover:text-white transition-colors">Réinitialiser</button>
                    </div>
                    {/* Location Filter */}
                    <div className="flex flex-col gap-3">
                        <p className="text-white text-base font-medium">Quartier</p>
                        <div className="flex w-full items-stretch rounded-xl bg-surface-dark border border-surface-highlight focus-within:border-primary transition-colors">
                            <input className="flex w-full bg-transparent text-white focus:outline-none h-12 px-4 placeholder:text-text-secondary text-sm" placeholder="Ex: Almadies, Mermoz..." />
                            <div className="flex items-center justify-center px-4 text-text-secondary">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                        </div>
                    </div>
                    {/* Date Filter */}
                    <div className="flex flex-col gap-3">
                        <p className="text-white text-base font-medium">Disponibilité</p>
                        <div className="bg-surface-dark border border-surface-highlight rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <button className="text-text-secondary hover:text-white">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <p className="text-white text-sm font-bold">Octobre 2023</p>
                                <button className="text-text-secondary hover:text-white">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                <span className="text-xs text-text-secondary font-bold">D</span>
                                <span className="text-xs text-text-secondary font-bold">L</span>
                                <span className="text-xs text-text-secondary font-bold">M</span>
                                <span className="text-xs text-text-secondary font-bold">M</span>
                                <span className="text-xs text-text-secondary font-bold">J</span>
                                <span className="text-xs text-text-secondary font-bold">V</span>
                                <span className="text-xs text-text-secondary font-bold">S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {/* Empty start days */}
                                <span></span><span></span><span></span><span></span>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">1</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">2</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">3</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">4</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm bg-primary text-background-dark font-bold">5</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">6</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">7</button>
                                {/* Truncated for brevity in visual */}
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">8</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">9</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full text-sm text-white hover:bg-white/10">10</button>
                            </div>
                        </div>
                    </div>
                    {/* Pitch Type Filter */}
                    <div className="flex flex-col gap-3">
                        <p className="text-white text-base font-medium">Type de terrain</p>
                        <div className="flex flex-wrap gap-2">
                            <label className="cursor-pointer">
                                <input defaultChecked className="peer sr-only" type="checkbox" />
                                <span className="block px-4 py-2 rounded-full border border-surface-highlight bg-surface-dark text-sm text-text-secondary peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all font-medium">5x5</span>
                            </label>
                            <label className="cursor-pointer">
                                <input className="peer sr-only" type="checkbox" />
                                <span className="block px-4 py-2 rounded-full border border-surface-highlight bg-surface-dark text-sm text-text-secondary peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all font-medium">7x7</span>
                            </label>
                            <label className="cursor-pointer">
                                <input className="peer sr-only" type="checkbox" />
                                <span className="block px-4 py-2 rounded-full border border-surface-highlight bg-surface-dark text-sm text-text-secondary peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all font-medium">11x11</span>
                            </label>
                            <label className="cursor-pointer">
                                <input className="peer sr-only" type="checkbox" />
                                <span className="block px-4 py-2 rounded-full border border-surface-highlight bg-surface-dark text-sm text-text-secondary peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all font-medium">Futsal</span>
                            </label>
                            <label className="cursor-pointer">
                                <input className="peer sr-only" type="checkbox" />
                                <span className="block px-4 py-2 rounded-full border border-surface-highlight bg-surface-dark text-sm text-text-secondary peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all font-medium">Indoor</span>
                            </label>
                        </div>
                    </div>
                    {/* Price Filter */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <p className="text-white text-base font-medium">Prix (FCFA)</p>
                            <span className="text-sm text-primary font-bold">10k - 50k</span>
                        </div>
                        <div className="relative h-2 w-full rounded-full bg-surface-dark">
                            <div className="absolute h-full bg-primary rounded-full left-[10%] right-[30%]"></div>
                            <div className="absolute h-4 w-4 bg-white border-2 border-primary rounded-full top-1/2 -translate-y-1/2 left-[10%] cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/20"></div>
                            <div className="absolute h-4 w-4 bg-white border-2 border-primary rounded-full top-1/2 -translate-y-1/2 right-[30%] cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/20"></div>
                        </div>
                    </div>
                    <button className="mt-auto w-full bg-primary hover:bg-orange-600 text-background-dark font-bold h-12 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">filter_list</span>
                        Appliquer les filtres
                    </button>
                </aside>

                {/* Main Content (Results) */}
                <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col gap-6">
                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden mb-2">
                        <button className="w-full bg-surface-dark border border-surface-highlight text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium">
                            <span className="material-symbols-outlined text-primary">tune</span>
                            Filtres & Recherche
                        </button>
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="group bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">5x5</span>
                                    <span className="bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">bolt</span> Dispo
                                    </span>
                                </div>
                                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                </button>
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Vibrant green indoor football pitch with goal post" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJyCPuvAPVIKcSLBSEdOMFL38okIhGumyFxHkp9sOCoG-JLXnxAjOjIyNBlVDzxdtHRnFNKW8j6WVHCDRnsx3naFwFW5VXtccX6A9ryHFg-L5pZ47TVQVXWZZsRieCw6GF6Pt2sK014Yi6Eu0rwwQt04PcnKlqLK0_kk8TKH66NYlcDI6WKF5NVvGPl5N90UrW_6loXUOxhy2p28ZMWxxFk4MfM-qWMaHkKjZisoz90EQhmOcPEvmb5u0bYZ8yygbJFPXb0FPeuA" alt="Vibrant green indoor football pitch" />
                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Five Star Almadies</h3>
                                        <div className="flex items-center gap-1 text-text-secondary mt-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">Almadies, Dakar</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                                        <span className="text-white text-sm font-bold">4.8</span>
                                        <span className="text-text-secondary text-xs">(120)</span>
                                    </div>
                                </div>
                                <div className="h-px bg-border-dark w-full my-1"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Prix par heure</span>
                                        <span className="text-lg font-bold text-white">25 000 F</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background-dark rounded-full text-sm font-bold transition-all">
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="group bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">7x7</span>
                                </div>
                                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                </button>
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Outdoor soccer field under stadium lights at night" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Wb84szBkwmR5OvfD5uJ2tICIw3GDBnLW2faRr6V0W5tW7aLn0QZPOSbTmJ7307Xt-jrL1I34D_tFyHUqKLcoQJtO1Ya0-YTtiKsuIwWkdrHZLg-1ywHtH1rTXUqRTmCyo6yOwgNbRs-qFnqc1IanMIxVZtTuiAdAtztUP7yA7tJ3FqSjG375-qfM99hoaa4zjfKL6IJK_IyOlpZIcgPM8Uk85ckZ1zTP_OXvEY3mgSchLrfqjzNuNLMuC4HYmjJvGvsSTzDeZw" alt="Outdoor soccer field" />
                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Stade Mermoz</h3>
                                        <div className="flex items-center gap-1 text-text-secondary mt-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">Mermoz, Dakar</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                                        <span className="text-white text-sm font-bold">4.5</span>
                                        <span className="text-text-secondary text-xs">(85)</span>
                                    </div>
                                </div>
                                <div className="h-px bg-border-dark w-full my-1"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Prix par heure</span>
                                        <span className="text-lg font-bold text-white">40 000 F</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background-dark rounded-full text-sm font-bold transition-all">
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="group bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Futsal</span>
                                </div>
                                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                </button>
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Indoor polished wooden futsal court" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA94FxhHE4pcG8ffC_8eUfxeZPnM9GFhZPsnxbDm_vKpaDhw3MjBNjoKpIa7EYiKyvtt0Mp17DA9Tm_xumwuKs4zodThFr0t6jPF9ZUoR_xaq_bAZmnnNa-nH31SZ6bRvf6iNPUZh5EPx0Eh240wBeWRehx42j9AOnmP6KVv7nYfV0mXQ1ciAB9paDvV8x5baUX487v74uw7vwb9rheqahoj6xpMJbNG2JfsVnsAip7nBfa8tVJeO7oizsaw5gZ9G-afxj7puz8Vg" alt="Indoor polished wooden futsal court" />
                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Urban Soccer Point E</h3>
                                        <div className="flex items-center gap-1 text-text-secondary mt-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">Point E, Dakar</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                                        <span className="text-white text-sm font-bold">4.9</span>
                                        <span className="text-text-secondary text-xs">(210)</span>
                                    </div>
                                </div>
                                <div className="h-px bg-border-dark w-full my-1"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Prix par heure</span>
                                        <span className="text-lg font-bold text-white">30 000 F</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background-dark rounded-full text-sm font-bold transition-all">
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 4 */}
                        <div className="group bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">5x5</span>
                                    <span className="bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">bolt</span> Dispo
                                    </span>
                                </div>
                                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                </button>
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="High angle view of a small artificial turf soccer field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN06CLCs3ezYW-NPMha2qXhIlF1CvldedIJOIfQQn-0igc48Ph3jYbDOa1zpFCmuym39TwepFgkqqU874VpAL2TJzEq9C8iNanusM46o8-JZpFGotQuRNLpLsX0OuHtqaaaI4jRo96vINN5xSoqBRXbJp8_jGXGvBcSJHykKn_UKnm4EnvKUhhjIfec5g9UQqgtXUl92dxCBERebuG2yqNSEF4uU0ODuHpyYIAWM1fcvl27SoO_CCKfX65WQyPtOPH9pVkFXzObQ" alt="High angle view of a small artificial turf soccer field" />
                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Sacré-Cœur Arena</h3>
                                        <div className="flex items-center gap-1 text-text-secondary mt-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">Sacré-Cœur 3, Dakar</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                                        <span className="text-white text-sm font-bold">4.2</span>
                                        <span className="text-text-secondary text-xs">(45)</span>
                                    </div>
                                </div>
                                <div className="h-px bg-border-dark w-full my-1"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Prix par heure</span>
                                        <span className="text-lg font-bold text-white">20 000 F</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background-dark rounded-full text-sm font-bold transition-all">
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 5 */}
                        <div className="group bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">11x11</span>
                                </div>
                                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                </button>
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Wide professional football stadium field sunny day" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6r0K4GTN9PNktFdDG3vqP2-h9eMEiyXWkJ9e9fbAoOJrM5miq1CmXZSoFNGsVo274xDpHUpJ3wsZOkPP8W9zi9IlGEOxeGG4G7QicL9_x3kJdYRxjJSCpdrM9WvyXXhTQqazC2rnhhwbaIZCLWUwIDM2coiZdk4wE_zPaaXyoxYhgRXPLlmGYy3-lcsBWLa-RsVffWTWMjAP3rhzAcYz17v1MAnTFhla4nOWJf4YikbRxi7NKOHR08bvdTQeTbvFAmkFx_jli-w" alt="Wide professional football stadium field" />
                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Stade Léopold S. Senghor</h3>
                                        <div className="flex items-center gap-1 text-text-secondary mt-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">Parcelles Assainies, Dakar</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                                        <span className="text-white text-sm font-bold">4.7</span>
                                        <span className="text-text-secondary text-xs">(302)</span>
                                    </div>
                                </div>
                                <div className="h-px bg-border-dark w-full my-1"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Prix par heure</span>
                                        <span className="text-lg font-bold text-white">75 000 F</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background-dark rounded-full text-sm font-bold transition-all">
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 6 */}
                        <div className="group bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">7x7</span>
                                </div>
                                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                </button>
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Blue artificial turf football field training ground" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy-AEaIEtnTsDPpunuRR1lvS9Eep78iemMHaYtjAKy5WDo1xHo-LqDhe6jpuR-jGkFJH6ckRTD-VYrHHUa0RMSASB1LhMC3BM_BbW9EtcsnNGNCWuhzn7l8lIvN2uAZd5Vo6if0Be98FF7nsErVwi3NX5Gx7qOjziKoiCjW0zFU01o5F6G7kSz9SaXCxwzDHLjSEE_DsQpB3d_b0BOxUxocdD6MgJ8ikFjanKDGdu8PLlrrjOkXHGNcySh_wO3yeXtpzZ_zQp75A" alt="Blue artificial turf football field" />
                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Olympique Ngor</h3>
                                        <div className="flex items-center gap-1 text-text-secondary mt-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">Ngor, Dakar</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                                        <span className="text-white text-sm font-bold">4.6</span>
                                        <span className="text-text-secondary text-xs">(92)</span>
                                    </div>
                                </div>
                                <div className="h-px bg-border-dark w-full my-1"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Prix par heure</span>
                                        <span className="text-lg font-bold text-white">35 000 F</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background-dark rounded-full text-sm font-bold transition-all">
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-surface-dark transition-colors">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-background-dark font-bold">1</button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-dark hover:text-white transition-colors">2</button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-dark hover:text-white transition-colors">3</button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-surface-dark transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SearchPage;
