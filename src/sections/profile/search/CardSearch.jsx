

const CardSearch = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="group bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden">
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                5x5
              </span>
              <span className="bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">
                  bolt
                </span>{" "}
                Dispo
              </span>
            </div>
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                favorite
              </span>
            </button>
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="Vibrant green indoor football pitch with goal post"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJyCPuvAPVIKcSLBSEdOMFL38okIhGumyFxHkp9sOCoG-JLXnxAjOjIyNBlVDzxdtHRnFNKW8j6WVHCDRnsx3naFwFW5VXtccX6A9ryHFg-L5pZ47TVQVXWZZsRieCw6GF6Pt2sK014Yi6Eu0rwwQt04PcnKlqLK0_kk8TKH66NYlcDI6WKF5NVvGPl5N90UrW_6loXUOxhy2p28ZMWxxFk4MfM-qWMaHkKjZisoz90EQhmOcPEvmb5u0bYZ8yygbJFPXb0FPeuA"
              alt="Vibrant green indoor football pitch"
            />
          </div>
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  Five Star Almadies
                </h3>
                <div className="flex items-center gap-1 text-text-secondary mt-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  <span className="text-sm">Almadies, Dakar</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm fill-1">
                  star
                </span>
                <span className="text-white text-sm font-bold">4.8</span>
                <span className="text-text-secondary text-xs">(120)</span>
              </div>
            </div>
            <div className="h-px bg-border-dark w-full my-1"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">
                  Prix par heure
                </span>
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
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                7x7
              </span>
            </div>
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                favorite
              </span>
            </button>
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="Outdoor soccer field under stadium lights at night"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Wb84szBkwmR5OvfD5uJ2tICIw3GDBnLW2faRr6V0W5tW7aLn0QZPOSbTmJ7307Xt-jrL1I34D_tFyHUqKLcoQJtO1Ya0-YTtiKsuIwWkdrHZLg-1ywHtH1rTXUqRTmCyo6yOwgNbRs-qFnqc1IanMIxVZtTuiAdAtztUP7yA7tJ3FqSjG375-qfM99hoaa4zjfKL6IJK_IyOlpZIcgPM8Uk85ckZ1zTP_OXvEY3mgSchLrfqjzNuNLMuC4HYmjJvGvsSTzDeZw"
              alt="Outdoor soccer field"
            />
          </div>
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  Stade Mermoz
                </h3>
                <div className="flex items-center gap-1 text-text-secondary mt-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  <span className="text-sm">Mermoz, Dakar</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm fill-1">
                  star
                </span>
                <span className="text-white text-sm font-bold">4.5</span>
                <span className="text-text-secondary text-xs">(85)</span>
              </div>
            </div>
            <div className="h-px bg-border-dark w-full my-1"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">
                  Prix par heure
                </span>
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
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Futsal
              </span>
            </div>
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                favorite
              </span>
            </button>
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="Indoor polished wooden futsal court"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA94FxhHE4pcG8ffC_8eUfxeZPnM9GFhZPsnxbDm_vKpaDhw3MjBNjoKpIa7EYiKyvtt0Mp17DA9Tm_xumwuKs4zodThFr0t6jPF9ZUoR_xaq_bAZmnnNa-nH31SZ6bRvf6iNPUZh5EPx0Eh240wBeWRehx42j9AOnmP6KVv7nYfV0mXQ1ciAB9paDvV8x5baUX487v74uw7vwb9rheqahoj6xpMJbNG2JfsVnsAip7nBfa8tVJeO7oizsaw5gZ9G-afxj7puz8Vg"
              alt="Indoor polished wooden futsal court"
            />
          </div>
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  Urban Soccer Point E
                </h3>
                <div className="flex items-center gap-1 text-text-secondary mt-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  <span className="text-sm">Point E, Dakar</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm fill-1">
                  star
                </span>
                <span className="text-white text-sm font-bold">4.9</span>
                <span className="text-text-secondary text-xs">(210)</span>
              </div>
            </div>
            <div className="h-px bg-border-dark w-full my-1"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">
                  Prix par heure
                </span>
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
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                5x5
              </span>
              <span className="bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">
                  bolt
                </span>{" "}
                Dispo
              </span>
            </div>
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                favorite
              </span>
            </button>
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="High angle view of a small artificial turf soccer field"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN06CLCs3ezYW-NPMha2qXhIlF1CvldedIJOIfQQn-0igc48Ph3jYbDOa1zpFCmuym39TwepFgkqqU874VpAL2TJzEq9C8iNanusM46o8-JZpFGotQuRNLpLsX0OuHtqaaaI4jRo96vINN5xSoqBRXbJp8_jGXGvBcSJHykKn_UKnm4EnvKUhhjIfec5g9UQqgtXUl92dxCBERebuG2yqNSEF4uU0ODuHpyYIAWM1fcvl27SoO_CCKfX65WQyPtOPH9pVkFXzObQ"
              alt="High angle view of a small artificial turf soccer field"
            />
          </div>
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  Sacré-Cœur Arena
                </h3>
                <div className="flex items-center gap-1 text-text-secondary mt-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  <span className="text-sm">Sacré-Cœur 3, Dakar</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm fill-1">
                  star
                </span>
                <span className="text-white text-sm font-bold">4.2</span>
                <span className="text-text-secondary text-xs">(45)</span>
              </div>
            </div>
            <div className="h-px bg-border-dark w-full my-1"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">
                  Prix par heure
                </span>
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
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                11x11
              </span>
            </div>
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                favorite
              </span>
            </button>
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="Wide professional football stadium field sunny day"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6r0K4GTN9PNktFdDG3vqP2-h9eMEiyXWkJ9e9fbAoOJrM5miq1CmXZSoFNGsVo274xDpHUpJ3wsZOkPP8W9zi9IlGEOxeGG4G7QicL9_x3kJdYRxjJSCpdrM9WvyXXhTQqazC2rnhhwbaIZCLWUwIDM2coiZdk4wE_zPaaXyoxYhgRXPLlmGYy3-lcsBWLa-RsVffWTWMjAP3rhzAcYz17v1MAnTFhla4nOWJf4YikbRxi7NKOHR08bvdTQeTbvFAmkFx_jli-w"
              alt="Wide professional football stadium field"
            />
          </div>
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  Stade Léopold S. Senghor
                </h3>
                <div className="flex items-center gap-1 text-text-secondary mt-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  <span className="text-sm">Parcelles Assainies, Dakar</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm fill-1">
                  star
                </span>
                <span className="text-white text-sm font-bold">4.7</span>
                <span className="text-text-secondary text-xs">(302)</span>
              </div>
            </div>
            <div className="h-px bg-border-dark w-full my-1"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">
                  Prix par heure
                </span>
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
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                7x7
              </span>
            </div>
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-background-dark transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                favorite
              </span>
            </button>
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="Blue artificial turf football field training ground"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy-AEaIEtnTsDPpunuRR1lvS9Eep78iemMHaYtjAKy5WDo1xHo-LqDhe6jpuR-jGkFJH6ckRTD-VYrHHUa0RMSASB1LhMC3BM_BbW9EtcsnNGNCWuhzn7l8lIvN2uAZd5Vo6if0Be98FF7nsErVwi3NX5Gx7qOjziKoiCjW0zFU01o5F6G7kSz9SaXCxwzDHLjSEE_DsQpB3d_b0BOxUxocdD6MgJ8ikFjanKDGdu8PLlrrjOkXHGNcySh_wO3yeXtpzZ_zQp75A"
              alt="Blue artificial turf football field"
            />
          </div>
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  Olympique Ngor
                </h3>
                <div className="flex items-center gap-1 text-text-secondary mt-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  <span className="text-sm">Ngor, Dakar</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm fill-1">
                  star
                </span>
                <span className="text-white text-sm font-bold">4.6</span>
                <span className="text-text-secondary text-xs">(92)</span>
              </div>
            </div>
            <div className="h-px bg-border-dark w-full my-1"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">
                  Prix par heure
                </span>
                <span className="text-lg font-bold text-white">35 000 F</span>
              </div>
              <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background-dark rounded-full text-sm font-bold transition-all">
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardSearch;
