import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="bg-[#231a10]  min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-white selection:bg-primary selection:text-white font-display">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface-highlight bg-background-dark px-4 py-3 lg:px-10 fixed w-full top-0 z-50">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2 lg:gap-4 text-white ">
          
              <span class="material-symbols-outlined  text-primary inline-block">
                sports_soccer
              </span>
           
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
              Footbooking
            </h2>
          </div>
          {/* Search Bar */}
          <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full group">
              <div className="text-text-secondary flex border-none bg-surface-highlight items-center justify-center pl-4 rounded-l-xl border-r-0 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-surface-highlight focus:border-none h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal transition-all"
                placeholder="Rechercher un terrain..."
                defaultValue=""
              />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4 lg:gap-8">
          <nav className="hidden lg:flex items-center gap-9">
            <a
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal"
              href="#"
            >
              Accueil
            </a>
            <a
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal"
              href="#"
            >
              Terrains
            </a>
            <a
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal"
              href="#"
            >
              Communauté
            </a>
          </nav>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-[#d96f0b] transition-colors text-background-dark text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(242,127,13,0.3)]">
            <span className="truncate">Réserver</span>
          </button>
          {/* <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-surface-highlight cursor-pointer"
            data-alt="User avatar profile picture showing a smiling man"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANZo-U9PC-p0-W3YJGKyZzCp4doOgfJPo1-60I0UfsLUl7w6pbURIVYg3f_vYkQ62hTSfuQpDDI7IFpgdueIQt8TQ_Rjkwag7uclD6Hn9PA0KpkZ74TQiMrFaCF1JHMsn4QWIKkZnSzaijsxibT8yHNQrE1DfZItJO_Ih2RPeBkKCVjSh0A4chWocOGcJYgg0Q2PF9u2ttZ8sH6VVmEVkEsZWSl9-RGpEDB8YHCXkK6SgMyRMs1pywCsgqhxtEierXoAAFbYCFTQ')",
            }}
          ></div> */}
        </div>
      </header>
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
                { user.email }
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
          <div
            className="flex flex-col gap-6 pt-6 border-t border-surface-highlight"
            id="avis"
          >
            <h2 className="text-white text-2xl font-bold leading-tight">
              Mes Avis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pending Review Box */}
              <div className="rounded-2xl bg-linear-to-br from-surface-dark to-surface-highlight p-6 border border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/20 p-2 rounded-full text-primary">
                      <span className="material-symbols-outlined">
                        rate_review
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg">
                      Avis en attente
                    </h3>
                  </div>
                  <p className="text-text-secondary text-sm">
                    Comment s'est passé votre match au
                    <strong>Terrain Almadies</strong> le 05 Oct ?
                  </p>
                  <div className="flex gap-2 my-2">
                    <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                      star
                    </span>
                    <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                      star
                    </span>
                    <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                      star
                    </span>
                    <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                      star
                    </span>
                    <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                      star
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-background-dark/50 border border-surface-highlight rounded-lg p-3 text-white text-sm focus:border-primary focus:ring-0 resize-none h-24"
                    placeholder="Écrivez votre avis ici..."
                  ></textarea>
                  <button className="w-full bg-primary hover:bg-[#d96f0b] text-background-dark font-bold py-2 rounded-full mt-2 transition-colors">
                    Publier
                  </button>
                </div>
              </div>
              {/* Past Review Item */}
              <div className="rounded-2xl bg-surface-dark p-6 border border-surface-highlight flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-surface-highlight flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div>
                      <h4 className="text-white font-bold">
                        Terrain Corniche Ouest
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Publié le 28 Sept
                      </p>
                    </div>
                  </div>
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined text-[18px] fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px] fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px] fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px] fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px] fill-current text-surface-highlight">
                      star
                    </span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm italic">
                  "Super terrain, la pelouse est bien entretenue et l'éclairage
                  est top pour les matchs le soir. Je recommande !"
                </p>
                <div className="mt-auto flex justify-end">
                  <button className="text-text-secondary hover:text-white text-xs font-medium underline decoration-surface-highlight underline-offset-4">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* SECTION: Settings */}
          <div
            className="flex flex-col gap-6 pt-6 border-t border-surface-highlight"
            id="parametres"
          >
            <h2 className="text-white text-2xl font-bold leading-tight">
              Paramètres du compte
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Info Form */}
              <div className="lg:col-span-2 bg-surface-dark p-6 rounded-2xl border border-surface-highlight">
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    person
                  </span>
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Nom complet
                    </label>
                    <input
                      className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      type="text"
                      defaultValue="Saturo Gojo"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Email
                    </label>
                    <input
                      className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      type="email"
                      defaultValue={user.email}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Téléphone
                    </label>
                    <input
                      className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      type="tel"
                      defaultValue="+221 77 123 45 67"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Ville
                    </label>
                    <input
                      className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      type="text"
                      defaultValue="Dakar"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button className="bg-surface-highlight hover:bg-primary hover:text-background-dark text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-lg">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
              {/* Side Settings (Password & Notifications) */}
              <div className="flex flex-col gap-6">
                {/* Security */}
                <div className="bg-surface-dark p-6 rounded-2xl border border-surface-highlight">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      lock
                    </span>
                    Sécurité
                  </h3>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-background-dark hover:bg-surface-highlight/50 transition-colors border border-surface-highlight group mb-2">
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">
                        Mot de passe
                      </p>
                      <p className="text-text-secondary text-xs">
                        Dernière modif. il y a 3 mois
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-text-secondary group-hover:text-white">
                      chevron_right
                    </span>
                  </button>
                  <button className="w-full text-red-400 hover:text-red-300 text-sm font-medium py-2 text-left mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      logout
                    </span>
                    Se déconnecter
                  </button>
                </div>
                {/* Notifications */}
                <div className="bg-surface-dark p-6 rounded-2xl border border-surface-highlight flex-1">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      notifications
                    </span>
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary text-sm">
                        Rappels SMS
                      </span>
                      <button className="w-11 h-6 bg-primary rounded-full relative transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-background-dark ring-primary">
                        <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary text-sm">
                        Emails Promo
                      </span>
                      <button className="w-11 h-6 bg-surface-highlight rounded-full relative transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-background-dark ring-transparent">
                        <span className="absolute left-1 top-1 bg-gray-400 w-4 h-4 rounded-full transition-transform"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <footer className="mt-auto py-8 border-t border-surface-highlight bg-background-dark text-center">
        <div className="flex justify-center gap-6 mb-4">
          <a
            className="text-text-secondary hover:text-primary transition-colors"
            href="#"
          >
            À propos
          </a>
          <a
            className="text-text-secondary hover:text-primary transition-colors"
            href="#"
          >
            Confidentialité
          </a>
          <a
            className="text-text-secondary hover:text-primary transition-colors"
            href="#"
          >
            Aide
          </a>
        </div>
        <p className="text-text-secondary text-sm">
          © {new Date().getFullYear()} Footbooking Tous droits réservés.
        </p>
      </footer> */}
    </div>
  );
};

export default UserProfile;
