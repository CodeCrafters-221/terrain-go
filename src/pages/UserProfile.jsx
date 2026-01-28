import { useAuth } from "../context/AuthContext";
import Avis from "../sections/profile/Avis";
import HeaderProfile from "../sections/profile/HeaderProfile";
import Parametre from "../sections/profile/Parametre";

const UserProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-[#231a10] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#231a10] min-h-screen flex items-center justify-center text-white">
        <p>Veuillez vous connecter pour voir votre profil.</p>
      </div>
    );
  }

  
  return (
    <div className="bg-[#231a10] min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-white selection:bg-primary selection:text-white font-display">
      {/* Top Navigation Bar */}
      <HeaderProfile />
      
      {/* Main Content Area */}
      <main className="layout-container flex h-full grow flex-col w-full max-w-[1200px] mx-auto px-4 md:px-10 py-8 lg:py-12 pt-24 md:pt-28">
        
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row gap-6 items-center md:items-center justify-between p-6 md:p-8 bg-surface-dark rounded-3xl mb-8 border border-surface-highlight shadow-2xl relative overflow-hidden group">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto text-center md:text-left z-10">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 md:h-32 md:w-32 ring-4 ring-surface-highlight shadow-xl transition-transform hover:scale-105 duration-300"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/736x/0c/cb/ce/0ccbce52385d8b784a412dc9f55f3d30.jpg')",
              }}
            ></div>
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-white text-2xl md:text-[32px] font-bold leading-tight tracking-tight">
                {user.email}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  location_on
                </span>
                <p className="text-base font-medium">Dakar, Sénégal</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20 uppercase tracking-wider">
                  Joueur Régulier
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-highlight px-3 py-1 text-xs font-bold text-text-secondary ring-1 ring-inset ring-white/10 uppercase tracking-wider">
                  15 Matchs joués
                </span>
              </div>
            </div>
          </div>
          
          <button className="flex items-center justify-center gap-2 rounded-full h-12 px-8 bg-surface-highlight hover:bg-white hover:text-background-dark text-white text-sm font-bold transition-all w-full md:w-auto shadow-lg hover:shadow-xl z-10 group/btn">
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover/btn:-rotate-12">edit</span>
            <span>Modifier le profil</span>
          </button>
        </section>

        {/* Tabs Navigation */}
        <div className="sticky top-[73px] z-40 bg-[#231a10]/95 backdrop-blur-md pt-2 pb-2 mb-8 border-b border-surface-highlight w-full -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-8 overflow-x-auto hide-scrollbar snap-x">
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-primary text-white pb-3 px-2 min-w-fit cursor-pointer group snap-start transition-all"
              href="#reservations"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">
                  sports_soccer
                </span>
                <p className="text-sm font-bold leading-normal tracking-wide whitespace-nowrap">
                  Mes Réservations
                </p>
              </div>
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all snap-start"
              href="#avis"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  star
                </span>
                <p className="text-sm font-bold leading-normal tracking-wide whitespace-nowrap">
                  Mes Avis
                </p>
              </div>
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all snap-start"
              href="#parametres"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  settings
                </span>
                <p className="text-sm font-bold leading-normal tracking-wide whitespace-nowrap">
                  Paramètres
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {/* SECTION: Reservations */}
          <div
            className="flex flex-col gap-6 animate-fade-in"
            id="reservations"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">
                Prochaines Réservations
              </h2>
              <a
                className="text-primary text-sm font-bold hover:text-white transition-colors"
                href="#"
              >
                Voir tout
              </a>
            </div>

            {/* Upcoming Reservation Card */}
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 rounded-2xl bg-surface-dark p-1 border border-surface-highlight/50 hover:border-primary/50 transition-all shadow-lg hover:shadow-2xl hover:shadow-primary/5 group">
              <div
                className="w-full md:w-2/5 lg:w-1/3 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover rounded-xl relative overflow-hidden"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfvL2_8pRKWRbrv-YGlw1NSKeHQNaJEuj6VtESuN1gmd1mt1KtP8MuLoWO16foom1n3B9JxuMC8gaItZiz21Y1GPG-maspRNz7nNmq0vjoOet1F7ZYxl5TkJdoDlr_0UeS25yq0PoU-w4qQsdXl-ciFMXW0Wp-UW-dSTem4rtDG6WpvEiWLXivFSpqt8IPjh1WsSfWpU7I1hxWQvJO9SnWlIPxYZfKtiP2bVoY8PzaxRIZpVpYhXiGJNADKIlTO1q-L4CeT6vsbQ')",
                }}
              >
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"/>
              </div>
              
              <div className="flex flex-1 flex-col justify-between gap-4 p-4 md:py-4 md:pr-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-2">
                    <div>
                      <h3 className="text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        Match 5x5 - Terrain Mermoz
                      </h3>
                      <div className="flex items-center gap-1.5 text-text-secondary text-sm mt-1.5 font-medium">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          location_on
                        </span>
                        <span>Mermoz, Dakar</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500 ring-1 ring-inset ring-green-500/20 uppercase tracking-wide">
                      Confirmé
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-background-dark/50 px-3 py-2 rounded-lg border border-surface-highlight/50">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        calendar_today
                      </span>
                      <span className="text-white text-sm font-bold">
                        14 Oct
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-background-dark/50 px-3 py-2 rounded-lg border border-surface-highlight/50">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        schedule
                      </span>
                      <span className="text-white text-sm font-bold">
                        18:00 - 19:00
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                  <button className="flex items-center justify-center gap-2 rounded-full h-11 px-6 bg-primary text-background-dark text-sm font-bold hover:bg-white hover:text-primary transition-all shadow-lg shadow-primary/20 flex-1 md:flex-none md:min-w-[140px] transform active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">
                      qr_code_2
                    </span>
                    <span>Ticket</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-full h-11 px-6 bg-surface-highlight text-white text-sm font-bold hover:bg-surface-highlight/80 transition-all flex-1 md:flex-none hover:text-white/90">
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                    <span>Modifier</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-white text-xl font-bold leading-tight opacity-90 tracking-tight">
                Historique récent
              </h2>
            </div>

            {/* Past Reservation Card */}
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-2xl bg-surface-dark p-3 border border-surface-highlight/30 opacity-80 hover:opacity-100 transition-all group hover:border-surface-highlight">
              <div
                className="w-full md:w-1/3 lg:w-1/4 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
                data-alt="Sunny day soccer field view from corner flag"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnPO3vq4klSgMv97bZ7tnlOfluatwNhZT2fo3BHrG31Xa5ijeu4FVnIYSHO27rxnG9DoenYIwIhS5zhvtBS95Xmb8-cPGbV5GWPuvSt8vdxCmmDK1LbhXPcBEf98zY0WGDcKeJVn4-1oYuuKkzgfIhfsThZsfFG2fm72ZwHXqedKxicOCN0DWqV53xPGBDJZxhZQjGHN5LhR4I12wN3VaEOWjB1bXwYFs93GidUd17IMpqpAqNQuWS_t_zJy4LE0B1Z8t-x1FRcA')",
                }}
              ></div>
              <div className="flex flex-1 flex-col justify-between gap-3 p-2">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      Match 7x7 - Dakar Sacré-Cœur
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2.5 py-0.5 text-xs font-bold text-gray-400 ring-1 ring-inset ring-gray-500/20 uppercase tracking-wide">
                      Terminé
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    10 Oct, 20:00 • Sacré-Cœur, Dakar
                  </p>
                </div>
                <button className="flex w-fit items-center justify-center gap-2 rounded-full h-9 px-4 bg-surface-highlight/50 text-text-secondary text-sm font-bold hover:text-white hover:bg-primary transition-all mt-2 group/btn">
                  <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">
                    rate_review
                  </span>
                  <span>Laisser un avis</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* SECTION: Reviews */}
          <div id="avis" className="animate-fade-in-up">
            <Avis />
          </div>
          
          {/* SECTION: Settings */}
           <div id="parametres" className="animate-fade-in-up">
            <Parametre />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
