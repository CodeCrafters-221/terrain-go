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
    <div className="bg-[#231a10]  min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-white selection:bg-primary selection:text-white font-display">
      {/* Top Navigation Bar */}
      <HeaderProfile />
      <main className="layout-container mt-16 flex h-full grow flex-col w-full max-w-[1200px] mx-auto px-4 md:px-10 py-8 ">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-surface-dark rounded-2xl mb-8 border border-surface-highlight">
          <div className="flex gap-6 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 md:h-32 md:w-32 ring-4 ring-surface-highlight shadow-lg"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/736x/0c/cb/ce/0ccbce52385d8b784a412dc9f55f3d30.jpg')",
              }}
            ></div>
            <div className="flex flex-col justify-center gap-1">
              <h1 className="text-white text-2xl md:text-[32px] font-bold leading-tight tracking-[-0.015em]">
                {/* Saturo Gojo */}
                {user.email}
              </h1>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-[18px]">
                  location_on
                </span>
                <p className="text-base font-normal">Dakar, Sénégal</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Joueur Régulier
                </span>
                <span className="inline-flex items-center rounded-md bg-surface-highlight px-2 py-1 text-xs font-medium text-text-secondary ring-1 ring-inset ring-white/10">
                  15 Matchs joués
                </span>
              </div>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-full h-10 px-6 bg-surface-highlight hover:bg-[#5a432b] text-white text-sm font-bold transition-all w-full md:w-auto">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Modifier le profil</span>
          </button>
        </section>
        {/* Tabs Navigation */}
        <div className="sticky top-[73px] z-40 bg-background-dark/95 backdrop-blur-sm pt-2 pb-4 mb-6 border-b border-surface-highlight w-full">
          <div className="flex gap-8 overflow-x-auto hide-scrollbar">
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-primary text-white pb-3 px-2 min-w-fit cursor-pointer group"
              href="#reservations"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">
                  sports_soccer
                </span>
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  Mes Réservations
                </p>
              </div>
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all"
              href="#avis"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  star
                </span>
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  Mes Avis
                </p>
              </div>
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all"
              href="#parametres"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  settings
                </span>
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
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
              <h2 className="text-white text-2xl font-bold leading-tight">
                Prochaines Réservations
              </h2>
              <a
                className="text-primary text-sm font-medium hover:underline"
                href="#"
              >
                Voir tout
              </a>
            </div>
            {/* Upcoming Reservation Card */}
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-2xl bg-surface-dark p-4 border border-surface-highlight/50 hover:border-primary/50 transition-colors shadow-lg group">
              <div
                className="w-full md:w-1/3 lg:w-1/4 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover rounded-xl"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfvL2_8pRKWRbrv-YGlw1NSKeHQNaJEuj6VtESuN1gmd1mt1KtP8MuLoWO16foom1n3B9JxuMC8gaItZiz21Y1GPG-maspRNz7nNmq0vjoOet1F7ZYxl5TkJdoDlr_0UeS25yq0PoU-w4qQsdXl-ciFMXW0Wp-UW-dSTem4rtDG6WpvEiWLXivFSpqt8IPjh1WsSfWpU7I1hxWQvJO9SnWlIPxYZfKtiP2bVoY8PzaxRIZpVpYhXiGJNADKIlTO1q-L4CeT6vsbQ')",
                }}
              ></div>
              <div className="flex flex-1 flex-col justify-between gap-4 py-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white text-lg font-bold leading-tight">
                        Match 5x5 - Terrain Mermoz
                      </h3>
                      <div className="flex items-center gap-1 text-text-secondary text-sm mt-1">
                        <span className="material-symbols-outlined text-[16px]">
                          location_on
                        </span>
                        <span>Mermoz, Dakar</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                      Confirmé
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2 bg-background-dark px-3 py-2 rounded-lg border border-surface-highlight">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        calendar_month
                      </span>
                      <span className="text-white text-sm font-medium">
                        14 Oct
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-background-dark px-3 py-2 rounded-lg border border-surface-highlight">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        schedule
                      </span>
                      <span className="text-white text-sm font-medium">
                        18:00 - 19:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-auto">
                  <button className="flex items-center justify-center gap-2 rounded-full h-9 px-4 bg-primary text-background-dark text-sm font-bold hover:bg-[#d96f0b] transition-colors flex-1 md:flex-none md:min-w-[120px]">
                    <span className="material-symbols-outlined text-[18px]">
                      qr_code
                    </span>
                    <span>Ticket</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-full h-9 px-4 bg-surface-highlight text-white text-sm font-medium hover:bg-[#5a432b] transition-colors flex-1 md:flex-none">
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                    <span>Modifier</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-white text-xl font-bold leading-tight opacity-90">
                Historique récent
              </h2>
            </div>
            {/* Past Reservation Card */}
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-2xl bg-surface-dark p-4 border border-surface-highlight/30 opacity-80 hover:opacity-100 transition-all">
              <div
                className="w-full md:w-1/3 lg:w-1/4 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover rounded-xl grayscale group-hover:grayscale-0 transition-all"
                data-alt="Sunny day soccer field view from corner flag"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnPO3vq4klSgMv97bZ7tnlOfluatwNhZT2fo3BHrG31Xa5ijeu4FVnIYSHO27rxnG9DoenYIwIhS5zhvtBS95Xmb8-cPGbV5GWPuvSt8vdxCmmDK1LbhXPcBEf98zY0WGDcKeJVn4-1oYuuKkzgfIhfsThZsfFG2fm72ZwHXqedKxicOCN0DWqV53xPGBDJZxhZQjGHN5LhR4I12wN3VaEOWjB1bXwYFs93GidUd17IMpqpAqNQuWS_t_zJy4LE0B1Z8t-x1FRcA')",
                }}
              ></div>
              <div className="flex flex-1 flex-col justify-between gap-4 py-2">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      Match 7x7 - Dakar Sacré-Cœur
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-gray-400/10 px-2.5 py-0.5 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                      Terminé
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    10 Oct, 20:00 • Sacré-Cœur, Dakar
                  </p>
                </div>
                <button className="flex w-fit items-center justify-center gap-2 rounded-full h-8 px-4 bg-surface-highlight text-text-secondary text-sm font-medium hover:text-white hover:bg-surface-highlight/80 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">
                    rate_review
                  </span>
                  <span>Laisser un avis</span>
                </button>
              </div>
            </div>
          </div>
          {/* SECTION: Reviews */}
          <Avis />
          {/* SECTION: Settings */}
          <Parametre />
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
