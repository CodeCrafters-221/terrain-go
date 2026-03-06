import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import ReservationModal from "../components/ReservationModal";
import { ReviewService } from "../services/ReviewService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
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
  const { id } = useParams();
  const [terrain, setTerrain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ note: 5, commentaire: "" });

  useEffect(() => {
    const fetchTerrain = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("fields")
          .select(`
            *,
            field_images (url_image)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setTerrain(data);
      } catch (err) {
        console.error("Error fetching terrain:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      if (!id) return;
      try {
        const [reviewsData, stats] = await Promise.all([
          ReviewService.getTerrainReviews(id),
          ReviewService.getAverageRating(id),
        ]);
        setReviews(reviewsData);
        setRatingStats(stats);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchTerrain();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Veuillez vous connecter pour laisser un avis");
      return;
    }

    if (!newReview.commentaire.trim()) {
      toast.error("Veuillez ajouter un commentaire");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await ReviewService.addReview({
        utilisateur_id: user.id,
        terrain_id: id,
        note: newReview.note,
        commentaire: newReview.commentaire,
      });
      toast.success("Merci pour votre avis !");
      setNewReview({ note: 5, commentaire: "" });
      // Refresh reviews
      const [reviewsData, stats] = await Promise.all([
        ReviewService.getTerrainReviews(id),
        ReviewService.getAverageRating(id),
      ]);
      setReviews(reviewsData);
      setRatingStats(stats);
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Erreur lors de l'ajout de l'avis");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!terrain) {
    return (
      <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Terrain non trouvé</h2>
        <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const stadiumDataForModal = {
    id: terrain.id,
    city: terrain.name,
    price: terrain.price_per_hour || terrain.price || 0,
    location: terrain.adress,
    totalPlayers: terrain.pelouse,
    fieldStadium: terrain.pelouse,
    notes: "4.8",
    image: terrain.field_images?.[0]?.url_image || "https://placehold.co/600x400?text=No+Image",
    proprietaire_id: terrain.proprietaire_id
  };
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
          <span className="text-white font-medium">{terrain.name}</span>
        </div>

        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {terrain.name}
            </h1>
            <div className="flex items-center gap-4 text-text-secondary text-sm md:text-base">
              <span className="flex items-center gap-1">
                <MapPin className="text-primary w-5 h-5" />
                {terrain.adress}
              </span>
              <span className="w-1 h-1 rounded-full bg-text-secondary"></span>
              <span className="flex items-center gap-1">
                <Star className="text-primary w-5 h-5 fill-current" />
                <span className="text-white font-semibold">
                  {ratingStats.average}
                </span>
                <span>({ratingStats.count} avis)</span>
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
              style={{
                backgroundImage: `url('${terrain.field_images?.[0]?.url_image || "https://placehold.co/600x400?text=No+Image"}')`,
              }}
            ></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          {/* Secondary Images */}
          {/* Secondary Images - Mapping real images */}
          {terrain.field_images?.slice(1, 4).map((img, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer hidden md:block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${img.url_image}')` }}
              ></div>
            </div>
          ))}

          {/* Fallback if less than 5 images */}
          {(!terrain.field_images || terrain.field_images.length < 5) &&
            Array.from({
              length: Math.max(0, 4 - (terrain.field_images?.length || 1)),
            }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="relative group cursor-pointer hidden md:block bg-surface-dark/50 flex items-center justify-center border border-dashed border-surface-highlight"
              >
                <Search className="w-8 h-8 text-surface-highlight opacity-20" />
              </div>
            ))}

          {terrain.field_images?.length >= 5 && (
            <div className="relative group cursor-pointer hidden md:block">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${terrain.field_images[4].url_image}')`,
                }}
              ></div>
              {terrain.field_images.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-colors">
                  <span className="text-white font-bold text-lg">
                    +{terrain.field_images.length - 5} Photos
                  </span>
                </div>
              )}
            </div>
          )}
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
                  {terrain.description ||
                    "Aucune description disponible pour ce terrain."}
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
                <h3 className="text-xl font-bold text-white">
                  Avis ({ratingStats.count})
                </h3>
                <div className="flex items-center gap-2">
                  <Star className="text-primary w-5 h-5 fill-current" />
                  <span className="text-xl font-bold text-white">
                    {ratingStats.average}
                  </span>
                </div>
              </div>

              {/* Add Review Form */}
              {user && (
                <div className="mb-8 p-6 rounded-2xl bg-surface-dark border border-surface-light">
                  <h4 className="text-white font-bold mb-4">Laisser un avis</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-text-secondary mr-2">
                        Votre note :
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewReview({ ...newReview, note: star })
                          }
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReview.note
                                ? "text-primary fill-current"
                                : "text-text-secondary"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={newReview.commentaire}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          commentaire: e.target.value,
                        })
                      }
                      placeholder="Partagez votre expérience sur ce terrain..."
                      className="w-full bg-[#231a10] border border-surface-light rounded-xl p-4 text-white text-sm focus:border-primary outline-none transition-colors min-h-[100px]"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2 bg-primary text-[#231a10] font-bold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                      {isSubmittingReview ? "Envoi..." : "Publier l'avis"}
                    </button>
                  </form>
                </div>
              )}

              <div className="grid gap-6">
                {reviews.length === 0 ? (
                  <p className="text-text-secondary italic text-center py-4">
                    Aucun avis pour le moment.
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-surface-dark p-6 rounded-2xl border border-surface-light"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-10 rounded-full bg-cover bg-center bg-[#493622]"
                            style={
                              rev.profiles?.image
                                ? {
                                    backgroundImage: `url('${rev.profiles.image}')`,
                                  }
                                : {}
                            }
                          >
                            {!rev.profiles?.image && (
                              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold uppercase">
                                {rev.profiles?.name?.substring(0, 2) || "??"}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">
                              {rev.profiles?.name || "Anonyme"}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {new Date(rev.created_at).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-primary">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-[14px] h-[14px] ${
                                i <= rev.note ? "fill-current" : "opacity-30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm">
                        {rev.commentaire}
                      </p>
                    </div>
                  ))
                )}
              </div>
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
                    {(terrain.price || 0).toLocaleString()} FCFA
                  </span>
                  <span className="text-text-secondary text-sm">par heure</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-light px-2 py-1 rounded-md">
                  <Star className="text-primary w-4 h-4 fill-current" />
                  <span className="text-white font-bold text-sm">
                    {ratingStats.average}
                  </span>
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
              <button
                onClick={() => setIsReservationOpen(true)}
                className="w-full bg-primary hover:bg-primary-hover text-[#231a10] font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
              >
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
      {isReservationOpen && (
        <ReservationModal
          
          onClose={() => setIsReservationOpen(false)}
          stadium={stadiumDataForModal}
        />
      )}
    </div>
  );
}
