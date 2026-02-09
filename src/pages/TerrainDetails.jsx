import React from "react";
import {
  Trophy,
  Search,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Star,
  Share2,
  Heart,
  Shirt,
  ShowerHead,
  SquareParking,
  Wifi,
  Lightbulb,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function TerrainDetails() {
  return (
    <div className="bg-background-dark relative  text-text-main font-display antialiased overflow-x-hidden selection:bg-primary selection:text-white min-h-screen">
      {/* Navigation */}
      <div className="w-full border-b border-[#493622] bg-background-dark/95 backdrop-blur-sm sticky top-0 z-50">
        <header className="flex items-center justify-between whitespace-nowrap px-6 lg:px-10 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-8">
            <a
              className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity"
              href="#"
            >
              <Trophy className="w-8 h-8 text-primary" strokeWidth={1.5} />
              <h2 className="text-white text-xl font-bold leading-tight tracking-tight">
                Footbooking
              </h2>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a
                className="text-white text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Terrains
              </a>
              <a
                className="text-text-secondary text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Tournois
              </a>
              <a
                className="text-text-secondary text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Clubs
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center bg-surface-light rounded-full px-4 h-10 w-64 border border-b-surface-dark focus-within:border-primary/50 transition-all">
              <Search className="text-text-secondary w-5 h-5" />
              <input
                className="bg-transparent border-none text-white text-sm w-full outline-0 px-4 focus:ring-0 placeholder:text-text-secondary/70"
                placeholder="Rechercher un terrain..."
              />
            </div>
            <button className="flex items-center justify-center rounded-full h-10 px-6 bg-primary hover:bg-primary-hover text-[#231a10] text-sm font-bold transition-all shadow-lg shadow-primary/20">
              <span>Connexion</span>
            </button>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-10 py-6 pb-20">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <a
            className="text-text-secondary hover:text-primary transition-colors"
            href="#"
          >
            Accueil
          </a>
          <ChevronRight className="text-text-secondary w-3.5 h-3.5" />
          <a
            className="text-text-secondary hover:text-primary transition-colors"
            href="#"
          >
            Terrains
          </a>
          <ChevronRight className="text-text-secondary w-3.5 h-3.5" />
          <span className="text-white font-medium">Sacré-Cœur 1</span>
        </div>

        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Terrain Sacré-Cœur 1
            </h1>
            <div className="flex items-center gap-4 text-text-secondary text-sm md:text-base">
              <span className="flex items-center gap-1">
                <MapPin className="text-primary w-5 h-5" />
                Liberté 6, Dakar
              </span>
              <span className="w-1 h-1 rounded-full bg-text-secondary"></span>
              <span className="flex items-center gap-1">
                <Star className="text-primary w-5 h-5 fill-current" />
                <span className="text-white font-semibold">4.8</span>
                <span>(120 avis)</span>
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-surface-light bg-surface-dark hover:bg-surface-light text-white text-sm font-medium transition-colors">
              <Share2 className="w-[18px] h-[18px]" />
              Partager
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-surface-light bg-surface-dark hover:bg-surface-light text-white text-sm font-medium transition-colors">
              <Heart className="w-[18px] h-[18px]" />
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 h-[400px] md:h-[480px] rounded-2xl overflow-hidden">
          {/* Main Image */}
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt="Wide angle shot of a pristine green football pitch with floodlights at night"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9G-smcDI7_ZY4O3l7M_igoEFvDPPll4HogrwugRMV7gC5IRDh3rbiIm7W9AO5sD84wwlykw686_oYOoAh9paDHRSHQuoQ6v0OYlkBuZSsCRZqJ4YYVXLuSLfM4qfbk8mfgGklcI8sB3UZ2JLhB6X44bIiSoCBU7dz2kSPrrJik0Pr8Fw8QCuBKBOEvNT93xuMNZAC3oKzHDw_otwK4ZGgUjcdS9kzW9I8COecQPeLYfuzfE1upC0sVVpnMXpVLhB1TAEVba_EsQ')",
              }}
            ></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          {/* Secondary Images */}
          <div className="relative group cursor-pointer hidden md:block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt="Close up of artificial turf texture"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6u_asUgmafEf1oLRvX64CHAs8b9sKCs8WDeV2wSHqJ99y0_SbQNhGEfav7I7EvFA_iejco5yPWCdmk8YRSeNaaS-Z8p1cOxgKXXDWt8sOxqXYOQt8AJT_KMuW-PsaY54uijdszi8W0-UZmRHffguD2Y0EOAixf38TiO9V85YKjyS7Ez_GiiRsj7c9X56W6c5o683SP6gyzUcmiOJv1Uf1TbH_SiNC8K2_fDVEISzdm0H-4rb9pOJ6VM9UD_GnjVPBh8SjEwA98A')",
              }}
            ></div>
          </div>
          <div className="relative group cursor-pointer hidden md:block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt="Night view of goal post and net"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEQM3yuMAUbMYT0vPfvPKIvfpjkh3bRUmdg3v7B4u_A5b479O-rFoUXv5Y-_7VEs0anORXKSxfj29aRb7esDxk-AaifsfAzds9qtEQXeWgPpbdGrhUUNSC0s4-YRultRgAYIuETmDF-7SHXBgxjn8NwH9cvcpEFo5iNYTH_IPBwngiOlTBmgeX2jPdft1IAYVyOSFdqfNWMSK1zyP0Tiobke_E8vFds_NwHke5a32Btg3lLP6xpTuekGK5ogRaEIGDCkPqWpyQRw')",
              }}
            ></div>
          </div>
          <div className="relative group cursor-pointer hidden md:block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt="Locker room with benches"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRnPnQmIloorEyH82C-iaQFI2Fp9S-37zs6ZVArvLc24rQkhMc5L6U_Picl7L-MSMBTwOKn4QmomFaiDXVW4_bWqG-X_iyhaQXU3lwbumZE_E-sY6vAKnTu2idePUGH5Ip3v-b8iV5xZaCIe9l64kRT7TtA8sYvxaSLdZsuHPB8_QuK7uMcOxm-xRLqxfivDIa1aS4_oIOro_p3asy_yeMch8w_oaUv0xIeLv524iIrpJsxJJ8-jACw9Fkj6B0JlWl1hvxFuKg5g')",
              }}
            ></div>
          </div>
          <div className="relative group cursor-pointer hidden md:block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt="Action shot of players during a match"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRsu2Vjgq9bTgKlzlYPZpV6HQGlMc6c4ojgsjW9N7fiLtmEFQXpq1zRrntQ_uZdeP7yPEeHO36_N5_vOJL28STHRg_bmAgvcQVtiDt5Q4vpadVmbKdERFnlCiLBdc85f8nzz8ecNCMHLkWdQcyR1QmdQhKitNXdEu2pdQtdZgSe138C8hX0gsDeyKkRPQiSePEh8_NCvbYVFFvlpxAF3r4tsuIEeksXca_OTrzBP-CyM6eqR-nPbjilr2l1Bc6m-jBdz0c0hby8w')",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-colors">
              <span className="text-white font-bold text-lg">+5 Photos</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4">
                À propos de ce terrain
              </h3>
              <div className="text-text-secondary leading-relaxed space-y-4">
                <p>
                  Situé au cœur de Dakar, le terrain Sacré-Cœur 1 offre une
                  pelouse synthétique de dernière génération homologuée FIFA.
                  Idéal pour les matchs de 5x5 ou 7x7, ce complexe est
                  parfaitement éclairé pour vos sessions nocturnes.
                </p>
                <p>
                  Nous accueillons aussi bien les groupes d'amis que les
                  tournois d'entreprise. Profitez d'un espace sécurisé avec un
                  parking surveillé et une buvette pour vous rafraîchir après
                  l'effort.
                </p>
              </div>
            </section>

            {/* Amenities */}
            <section className="border-t border-surface-light pt-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Équipements et services
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-surface-light">
                  <Shirt className="text-primary w-5 h-5" />
                  <span className="text-sm font-medium text-white">
                    Vestiaires
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-surface-light">
                  <ShowerHead className="text-primary w-5 h-5" />
                  <span className="text-sm font-medium text-white">
                    Douches
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-surface-light">
                  <SquareParking className="text-primary w-5 h-5" />
                  <span className="text-sm font-medium text-white">
                    Parking
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-surface-light">
                  <Wifi className="text-primary w-5 h-5" />
                  <span className="text-sm font-medium text-white">
                    Wi-Fi Gratuit
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-surface-light">
                  <Lightbulb className="text-primary w-5 h-5" />
                  <span className="text-sm font-medium text-white">
                    Éclairage LED
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-surface-light">
                  <Trophy className="text-primary w-5 h-5" />
                  <span className="text-sm font-medium text-white">
                    Ballons fournis
                  </span>
                </div>
              </div>
            </section>

            {/* Interactive Calendar Mockup */}
            <section className="border-t border-surface-light pt-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Disponibilités
              </h3>
              <div className="bg-surface-dark rounded-2xl p-6 border border-surface-light">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button className="p-2 hover:bg-surface-light rounded-full text-text-secondary transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h4 className="text-lg font-semibold text-white">
                    Octobre 2023
                  </h4>
                  <button className="p-2 hover:bg-surface-light rounded-full text-text-secondary transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-4 text-center">
                  <span className="text-xs text-text-secondary uppercase tracking-wider">
                    Lun
                  </span>
                  <span className="text-xs text-text-secondary uppercase tracking-wider">
                    Mar
                  </span>
                  <span className="text-xs text-text-secondary uppercase tracking-wider">
                    Mer
                  </span>
                  <span className="text-xs text-text-secondary uppercase tracking-wider">
                    Jeu
                  </span>
                  <span className="text-xs text-text-secondary uppercase tracking-wider">
                    Ven
                  </span>
                  <span className="text-xs text-text-secondary uppercase tracking-wider text-primary">
                    Sam
                  </span>
                  <span className="text-xs text-text-secondary uppercase tracking-wider text-primary">
                    Dim
                  </span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {/* Previous month days */}
                  <div className="aspect-square flex items-center justify-center text-text-secondary/30 text-sm">
                    28
                  </div>
                  <div className="aspect-square flex items-center justify-center text-text-secondary/30 text-sm">
                    29
                  </div>
                  <div className="aspect-square flex items-center justify-center text-text-secondary/30 text-sm">
                    30
                  </div>
                  {/* Current month days */}
                  <button className="aspect-square rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-light text-sm">
                    1
                  </button>
                  <button className="aspect-square rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-light text-sm">
                    2
                  </button>
                  <button className="aspect-square rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-light text-sm">
                    3
                  </button>
                  <button className="aspect-square rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-light text-sm">
                    4
                  </button>
                  {/* Current Selection */}
                  <button className="aspect-square rounded-full bg-primary text-[#231a10] font-bold flex items-center justify-center text-sm shadow-lg shadow-primary/20">
                    5
                  </button>
                  <button className="aspect-square rounded-full flex items-center justify-center text-white hover:bg-surface-light text-sm">
                    6
                  </button>
                  <button className="aspect-square rounded-full flex items-center justify-center text-white hover:bg-surface-light text-sm">
                    7
                  </button>
                  <button className="aspect-square rounded-full flex items-center justify-center text-white hover:bg-surface-light text-sm">
                    8
                  </button>
                  {/* More days... */}
                </div>

                {/* Time Slots for selected day */}
                <div className="border-t border-surface-light pt-6">
                  <p className="text-sm text-text-secondary mb-4">
                    Créneaux disponibles pour le{" "}
                    <span className="text-white font-medium">5 Octobre</span> :
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg bg-surface-light text-text-secondary text-sm line-through opacity-50 cursor-not-allowed">
                      16:00
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-surface-light text-text-secondary text-sm line-through opacity-50 cursor-not-allowed">
                      17:00
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-surface-light text-white hover:bg-primary hover:text-surface-dark transition-colors text-sm border border-transparent hover:border-primary">
                      18:00
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-primary text-[#231a10] font-bold text-sm shadow-md">
                      19:00
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-surface-light text-white hover:bg-primary hover:text-surface-dark transition-colors text-sm border border-transparent hover:border-primary">
                      20:00
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-surface-light text-white hover:bg-primary hover:text-surface-dark transition-colors text-sm border border-transparent hover:border-primary">
                      21:00
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="border-t border-surface-light pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Avis (120)</h3>
                <div className="flex items-center gap-2">
                  <Star className="text-primary w-5 h-5 fill-current" />
                  <span className="text-xl font-bold text-white">4.8</span>
                </div>
              </div>
              <div className="grid gap-6">
                {/* Review Card 1 */}
                <div className="bg-surface-dark p-6 rounded-2xl border border-surface-light">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-10 rounded-full bg-cover bg-center"
                        data-alt="User avatar 1"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMkDB6v9rySbpKOHzFEvxwEUCsGbTql0WGgsGQ18Lf_k4UAlXWCiD9yzMdzAihGZZP4U443bg5_jKWBcUeNRG0XjvIng_O715WAMowdmQHWPiUBFHLGbap9MCJOlWUg8dw1ctxBqvUB3QYD28-6-kPVRmoHD802af9W2chmqJvhlz7agLIYBCMLkxLs8_syDp4Mv1WyJOPuaPY1xZJpn3Td1iPbiv5YuNW4Ya5TrOqGdvXTsZSTK4zbNMQyhKrpAWS_6fDhNJKGA')",
                        }}
                      ></div>
                      <div>
                        <p className="font-bold text-white text-sm">
                          Moussa Diop
                        </p>
                        <p className="text-xs text-text-secondary">
                          Il y a 2 jours
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-primary">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-[14px] h-[14px] fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm">
                    Très bon terrain, la pelouse est neuve et l'éclairage est
                    top pour jouer le soir. Juste un peu difficile de trouver
                    une place de parking le week-end.
                  </p>
                </div>
                {/* Review Card 2 */}
                <div className="bg-surface-dark p-6 rounded-2xl border border-surface-light">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-10 rounded-full bg-cover bg-center"
                        data-alt="User avatar 2"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-ymGU1LzJ1fUa493_EdfSpUPaiArrxn3aes-g1H320HFm6Yq7vT-bknPkk8oUui_lnXuOgH5jOxGq69xokTZcUHFwFCUiErF4CmN8Myb7GPwe6vmUy3aagrD0kN5vX3pF_dyA9uJufGR4REIc5jB28xiMOAJ-UlHXMhDDGC5KrFVgMbiL4qF5Zf3OMsIuWdF3JnBSclM8rEH4pgCvp7sRZV_wGUazQo3i7EY5whlnKwcfE83OJnBSqGUSUpFrnIwGd6HpwhWssA')",
                        }}
                      ></div>
                      <div>
                        <p className="font-bold text-white text-sm">
                          Aminata Sow
                        </p>
                        <p className="text-xs text-text-secondary">
                          Il y a 1 semaine
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-primary">
                      {[1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className="w-[14px] h-[14px] fill-current"
                        />
                      ))}
                      <Star className="w-[14px] h-[14px]" />
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm">
                    Super ambiance, les vestiaires sont propres. Je recommande
                    pour les tournois entre collègues.
                  </p>
                </div>
              </div>
              <button className="mt-6 w-full py-3 rounded-xl border border-surface-light text-white font-medium hover:bg-surface-light transition-colors text-sm">
                Voir les 118 autres avis
              </button>
            </section>

            {/* Map */}
            <section className="border-t border-surface-light pt-8">
              <h3 className="text-xl font-bold text-white mb-6">Emplacement</h3>
              <div className="w-full h-64 bg-surface-dark rounded-2xl overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center opacity-80"
                  data-alt="Static map view of Dakar Liberté 6 area"
                  data-location="Dakar"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbLGJqOpXHjL8jpfJumhVPzQTB1zcbHVRLSLpcHNT8J_qIzQfQtzRLFNnpn10TA1erIVIykEdXj0V39lQdaldkSfvw4HES2GII-rtPiyqQL1SBn3QPezjd_RtKPNKzN-QaAo3kiP1wVXOo8kpPCC7mmbJ_FjbRTOHRiKkJMFHCTTuuSH6MApooFYQuuXJxYXNHZDU9ffIFa0jTB-LI3wGY2KFH9leereTlEg9WFDM7ThvpqdzbDd15dZGrungybq8AglZRw6YZ_Q')",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full shadow-xl">
                    <div className="bg-primary p-2 rounded-full text-[#231a10]">
                      <Trophy className="w-6 h-6" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-text-secondary text-sm">
                Liberté 6, Dakar, Sénégal • À 5 min du rond-point JVC
              </p>
            </section>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="relative">
            <div className="sticky top-24 bg-surface-dark rounded-3xl p-6 border border-surface-light shadow-2xl">
              <div className="flex justify-between items-start mb-6 border-b border-surface-light pb-6">
                <div>
                  <span className="text-2xl font-bold text-white block">
                    25 000 FCFA
                  </span>
                  <span className="text-text-secondary text-sm">par heure</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-light px-2 py-1 rounded-md">
                  <Star className="text-primary w-4 h-4 fill-current" />
                  <span className="text-white font-bold text-sm">4.8</span>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                {/* Date/Time Display */}
                <div className="bg-[#231a10] rounded-xl p-4 border border-surface-light/50 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-secondary uppercase font-bold tracking-wide">
                      Date
                    </span>
                    <span className="text-white font-medium">
                      5 Octobre 2023
                    </span>
                  </div>
                  <Calendar className="text-primary w-5 h-5" />
                </div>
                <div className="bg-[#231a10] rounded-xl p-4 border border-surface-light/50 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-secondary uppercase font-bold tracking-wide">
                      Horaire
                    </span>
                    <span className="text-white font-medium">
                      19:00 - 20:00
                    </span>
                  </div>
                  <Clock className="text-primary w-5 h-5" />
                </div>
              </div>
              {/* Breakdown */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-text-secondary text-sm">
                  <span>25 000 x 1 heure</span>
                  <span>25 000 FCFA</span>
                </div>
                <div className="flex justify-between text-text-secondary text-sm">
                  <span>Frais de service</span>
                  <span>1 000 FCFA</span>
                </div>
                <div className="h-px bg-surface-light my-2"></div>
                <div className="flex justify-between text-white font-bold text-base">
                  <span>Total</span>
                  <span>26 000 FCFA</span>
                </div>
              </div>
              {/* CTA */}
              <button className="w-full bg-primary hover:bg-primary-hover text-[#231a10] font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group">
                Réserver ce terrain
                <ArrowRight className="transition-transform group-hover:translate-x-1 w-5 h-5" />
              </button>
              <p className="text-center text-xs text-text-secondary mt-4">
                Aucun débit immédiat. Annulation gratuite jusqu'à 24h avant.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
