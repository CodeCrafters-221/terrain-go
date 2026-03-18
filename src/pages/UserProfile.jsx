<<<<<<< HEAD
import React from "react";
import AboutUser from "../sections/AboutUser";
export default function UserProfile() {
  return (
    <>
      <div className=" bg-mainBg ">
        <AboutUser />
        {/* <TabNavigation /> */}
      </div>
    </>
  );
}
=======
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Avis, { ReviewModal } from "../sections/profile/Avis";
import HeaderProfile from "../sections/profile/HeaderProfile";
import Parametre from "../sections/profile/Parametre";
import { ReservationService } from "../services/ReservationService";
import { generateTicket } from "../utils/ticketGenerator";
import {
  MapPin,
  Edit2,
  CalendarCheck,
  Star,
  Settings,
  Calendar,
  Clock,
  QrCode,
  MessageSquarePlus,
  Loader2,
} from "lucide-react";

const UserProfile = () => {
  const { user, loading: authLoading, profile } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTerrainForReview, setSelectedTerrainForReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [refreshReviewsCounter, setRefreshReviewsCounter] = useState(0);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      try {
        const data = await ReservationService.getUserReservations();
        setReservations(data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setIsLoading(false);
      }
    };


    if (user) {
      fetchReservations();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="bg-[#231a10] min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
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

  // Séparer les réservations à venir des passées avec précision
  const now = new Date();

  const upcomingReservations = [];
  const pastReservations = [];

  reservations.forEach(r => {
    // Création d'un objet Date propre pour la comparaison
    // On assume r.date est YYYY-MM-DD et r.startTime est HH:mm:ss
    const resDateTime = new Date(`${r.date}T${r.startTime}`);
    // Utiliser endTime pour la fin du match, sinon considérer startTime
    const resEndDateTime = r.endTime ? new Date(`${r.date}T${r.endTime}`) : resDateTime;

    if (isNaN(resDateTime.getTime()) || resDateTime >= now) {
      upcomingReservations.push(r);
    } else {
      // Pour l'historique RÉCENT, on ne garde que ce qui s'est fini il y a moins de 15 minutes
      // pour éviter d'avoir une liste trop longue comme demandé par le client
      const fifteenMinutesInMs = 15 * 60 * 1000;
      if (now - resEndDateTime < fifteenMinutesInMs) {
        pastReservations.push(r);
      }
    }
  });

  return (
    <div className="bg-[#231a10] min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-white selection:bg-primary selection:text-white font-display">
      <HeaderProfile />

      <main className="layout-container flex h-full grow flex-col w-full max-w-5xl mx-auto px-4 md:px-10 py-8 lg:py-12 pt-24 md:pt-28">
        {/* Profile Header (Original Big Size) */}
        <section className="flex flex-col md:flex-row gap-6 items-center md:items-center justify-between p-6 md:p-8 bg-surface-dark rounded-3xl mb-8 border border-surface-highlight shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto text-center md:text-left z-10">
            <img className="rounded-full object-cover size-28 md:size-32 shadow-xl transition-transform hover:scale-105 duration-300"
              src={profile?.image || "https://imgs.search.brave.com/SU6DjXUVoDrdq7vpMSVNfbUFdVDH5Po5Tp5hxoZmMRg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC84/Mi8wOC9tYWxlLWFu/ZC1mZW1hbGUtcHJv/ZmlsZS1zaWxob3Vl/dHRlcy12ZWN0b3It/Mzg1NzgyMDguanBn"}
            />
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-white text-2xl md:text-[32px] font-bold leading-tight tracking-tight">
                {profile?.name || "Utilisateur"}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-text-secondary">
                <MapPin className="w-5 h-5 text-primary" />
                <p className="text-base font-medium">{profile?.ville || "Sénégal"}</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20 uppercase tracking-wider">
                  {profile?.role === "owner" ? "Propriétaire" : "Client"}
                </span>
              </div>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-full h-12 px-8 bg-surface-highlight hover:bg-white hover:text-background-dark text-white text-sm font-bold transition-all w-full md:w-auto shadow-lg hover:shadow-xl z-10 group/btn">
            <Edit2 className="w-5 h-5 transition-transform group-hover/btn:-rotate-12" />
            <a href="#mes-informations">Mes Informations</a>
          </button>
        </section>

        {/* Tabs Navigation */}
        <div className="sticky top-18.25 z-40 bg-[#231a10]/95 backdrop-blur-md pt-2 pb-2 mb-8 border-b border-surface-highlight w-full -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-8 overflow-x-auto hide-scrollbar snap-x">
            <a className="flex flex-col items-center justify-center border-b-[3px] border-primary text-white pb-3 px-2 min-w-fit cursor-pointer transition-all snap-start" href="#mes-informations">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <p className="text-sm font-bold leading-normal tracking-wide whitespace-nowrap">Mes Informations</p>
              </div>
            </a>
            <a className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all snap-start" href="#reservations">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                <p className="text-sm font-bold leading-normal tracking-wide whitespace-nowrap">Mes Réservations</p>
              </div>
            </a>
            <a className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all snap-start" href="#avis">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <p className="text-sm font-bold leading-normal tracking-wide whitespace-nowrap">Mes Avis</p>
              </div>
            </a>
          </div>
        </div>


        <div className="flex flex-col gap-12">
          <div id="mes-informations" className="animate-fade-in-up">
            <Parametre />
          </div>

          {/* SECTION: Reservations */}
          <div className="flex flex-col gap-6 animate-fade-in" id="reservations">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">
                Prochaines Réservations
              </h2>
              <p className="text-primary text-sm font-bold">({upcomingReservations.length})</p>
            </div>

            {upcomingReservations.length > 0 ? (
              upcomingReservations.map((res) => (
                <div key={res.id} className="flex flex-col md:flex-row items-stretch justify-between gap-6 rounded-2xl bg-surface-dark p-1 border border-surface-highlight/50 hover:border-primary/50 transition-all shadow-lg hover:shadow-2xl group">
                  <div
                    className="w-full md:w-2/5 lg:w-1/3 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover rounded-xl relative overflow-hidden"
                    style={{ backgroundImage: `url(${res.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80'})` }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-4 md:py-4 md:pr-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-2">
                        <div>
                          <h3 className="text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                            {res.terrainName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-text-secondary text-sm mt-1.5 font-medium">
                            <MapPin className="w-[18px] h-[18px] text-primary" />
                            <span>{res.location}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset uppercase tracking-wide ${res.status === 'Confirmé' ? 'bg-green-500/10 text-green-500 ring-green-500/20' : 'bg-orange-500/10 text-orange-500 ring-orange-500/20'
                          }`}>
                          {res.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex items-center gap-2 bg-background-dark/50 px-3 py-2 rounded-lg border border-surface-highlight/50">
                          <Calendar className="text-primary w-5 h-5" />
                          <span className="text-white text-sm font-bold">{new Date(res.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-background-dark/50 px-3 py-2 rounded-lg border border-surface-highlight/50">
                          <Clock className="text-primary w-5 h-5" />
                          <span className="text-white text-sm font-bold">{res.startTime.substring(0, 5)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                      {(res.status === 'Payé' || res.status === 'Confirmé') ? (
                        <button
                          onClick={() => {
                            try {
                              // Sécurité pour les heures qui peuvent être absentes ou mal formatées
                              const startTime = res.startTime ? (res.startTime.includes(':') ? res.startTime.substring(0, 5) : res.startTime) : "00:00";
                              const endTime = res.endTime ? (res.endTime.includes(':') ? res.endTime.substring(0, 5) : res.endTime) : "00:00";

                              generateTicket({
                                id: res.id,
                                clientName: profile?.name || "Joueur",
                                clientPhone: profile?.phone || profile?.telephone || "Non renseigné",
                                fieldName: res.terrainName || "Terrain",
                                date: res.date || "Date inconnue",
                                time: `${startTime} - ${endTime}`,
                                status: res.status,
                                paymentMethod: "Mobile Money"
                              });
                            } catch (err) {
                              console.error("Erreur lors de la génération du ticket:", err);
                              alert("Une erreur est survenue lors de la génération du ticket. Veuillez réessayer.");
                            }
                          }}
                          className="flex items-center justify-center gap-2 rounded-full h-11 px-6 bg-primary text-background-dark text-sm font-bold hover:bg-white hover:text-primary transition-all shadow-lg flex-1 md:flex-none md:min-w-[140px]"
                        >
                          <QrCode className="w-5 h-5" />
                          <span>Télécharger Ticket</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-[#cbad90] text-xs font-medium bg-white/5 px-4 py-2 rounded-xl border border-white/5 italic">
                          <Clock className="w-4 h-4 animate-pulse text-orange-500" />
                          En attente de validation du propriétaire...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-surface-dark/50 rounded-2xl border border-dashed border-surface-highlight">
                <p className="text-text-secondary">Aucune réservation à venir.</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-white text-xl font-bold leading-tight opacity-90 tracking-tight">
                Historique récent
              </h2>
            </div>

            {pastReservations.length > 0 ? (
              pastReservations.map((res) => (
                <div key={res.id} className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-2xl bg-surface-dark p-3 border border-surface-highlight/30 opacity-80 hover:opacity-100 transition-all group">
                  <div
                    className="w-full md:w-1/3 lg:w-1/4 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
                    style={{ backgroundImage: `url(${res.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80'})` }}
                  ></div>
                  <div className="flex flex-1 flex-col justify-between gap-3 p-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h3 className="text-white text-lg font-bold leading-tight">{res.terrainName}</h3>
                        <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2.5 py-0.5 text-xs font-bold text-gray-400 ring-1 ring-inset ring-gray-500/20 uppercase tracking-wide">Terminé</span>
                      </div>
                      <p className="text-text-secondary text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(res.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}, {res.startTime.substring(0, 5)} • {res.location}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTerrainForReview(res);
                        setIsReviewModalOpen(true);
                      }}
                      className="flex w-fit items-center justify-center gap-2 rounded-full h-9 px-4 bg-surface-highlight/50 text-text-secondary text-sm font-bold hover:text-white hover:bg-primary transition-all mt-2 group/btn"
                    >
                      <MessageSquarePlus className="w-[18px] h-[18px] group-hover/btn:scale-110 transition-transform" />
                      <span>Laisser un avis</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-center py-4">Pas d'historique de matchs.</p>
            )}
          </div>

          <div id="avis" className="animate-fade-in-up">
            <Avis key={refreshReviewsCounter} />
          </div>


        </div>
      </main>

      {selectedTerrainForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedTerrainForReview(null);
          }}
          terrain={selectedTerrainForReview}
          onReviewed={() => {
            setRefreshReviewsCounter(prev => prev + 1);
            // On pourrait aussi marquer la réservation comme "avis donné" si on avait un champ en BD
          }}
        />
      )}
    </div>
  );
};


export default UserProfile;

>>>>>>> c1eb517d823af4dfa0650358f8eaa659c67727b4
