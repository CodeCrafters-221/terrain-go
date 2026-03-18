import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import ReservationModal from "../components/ReservationModal";
import { ReviewService } from "../services/ReviewService";
import { AvailabilityService } from "../services/AvailabilityService";
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
  Camera,
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!id || !selectedDate) return;
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedTimeSlot("");
      try {
        const slots = await AvailabilityService.getAvailableSlots(id, selectedDate, "1");
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Erreur disponibilité :", err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [id, selectedDate]);

  const handleImageClick = () => {
    if (user && terrain && user.id === terrain.proprietaire_id) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user || user.id !== terrain?.proprietaire_id) {
      toast.error("Non autorisé");
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("terrain-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("terrain-images")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("field_images")
        .insert({
          terrain_id: terrain.id,
          url_image: publicUrl
        });
      
      if (dbError) throw dbError;

      setTerrain((prev) => ({
        ...prev,
        field_images: [...(prev.field_images || []), { url_image: publicUrl }]
      }));
      toast.success("Image ajoutée avec succès");
      
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Erreur lors de l'ajout de l'image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    if (!user || user.id !== terrain?.proprietaire_id) return;
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      // Find the image in local state first to get its storage path
      const imageObj = terrain.field_images.find(img => img.url_image === imageUrl);
      if (!imageObj) return;

      // Extrait le nom du fichier depuis l'URL publique de Supabase
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from("terrain-images")
        .remove([fileName]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
        // Continue to try db delete even if storage fails, to clean up state
      }

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from("field_images")
        .delete()
        .match({ url_image: imageUrl, terrain_id: terrain.id });

      if (dbError) throw dbError;

      // 3. Update local state
      setTerrain((prev) => ({
        ...prev,
        field_images: prev.field_images.filter((img) => img.url_image !== imageUrl)
      }));
      
      toast.success("Image supprimée");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Erreur lors de la suppression de l'image");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier !");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Impossible de copier le lien");
    }
  };

  const [isSaved, setIsSaved] = useState(false);
  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("Terrain ajouté aux favoris !");
    } else {
      toast.info("Terrain retiré des favoris.");
    }
  };

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

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-10 py-6 pb-20">
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
            {user && terrain && user.id === terrain.proprietaire_id && (
              <button 
                onClick={handleImageClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
              >
                {isUploadingImage ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div> : <Camera className="w-[18px] h-[18px]" />}
                Ajouter photo
              </button>
            )}
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full border border-surface-light bg-surface-dark hover:bg-surface-light text-white text-sm font-medium transition-colors">
              <Share2 className="w-[18px] h-[18px]" />
              Partager
            </button>
            <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-full border border-surface-light bg-surface-dark hover:bg-surface-light text-sm font-medium transition-colors ${isSaved ? "text-primary" : "text-white"}`}>
              <Heart className={`w-[18px] h-[18px] ${isSaved ? "fill-primary" : ""}`} />
              {isSaved ? "Sauvegardé" : "Sauvegarder"}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-10 h-auto md:h-[480px] rounded-2xl overflow-hidden">
          {/* Main Image */}
          <div className="col-span-2 md:row-span-2 h-[200px] md:h-auto relative group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('${terrain.field_images?.[0]?.url_image || "https://placehold.co/600x400?text=No+Image"}')`,
              }}
            ></div>
            {user?.id === terrain.proprietaire_id && terrain.field_images?.[0] && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                {/* <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteImage(terrain.field_images[0].url_image); }}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-black/50 pointer-events-auto"
                  title="Supprimer l'image"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button> */}
              </div>
            )}
          </div>
          {/* Secondary Images - Mapping real images */}
          {terrain.field_images?.slice(1, 4).map((img, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer h-[100px] md:h-auto"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${img.url_image}')` }}
              ></div>
              {user?.id === terrain.proprietaire_id && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.url_image); }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-black/50 pointer-events-auto"
                    title="Supprimer l'image"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Fallback if less than 5 images */}
          {(!terrain.field_images || terrain.field_images.length < 5) &&
            Array.from({
              length: Math.max(0, 4 - (terrain.field_images?.length || 1)),
            }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                onClick={handleImageClick}
                className={`relative group flex h-[100px] md:h-auto bg-surface-dark/50 items-center justify-center border border-dashed border-surface-highlight ${user?.id === terrain.proprietaire_id ? "cursor-pointer hover:bg-surface-light/10" : "opacity-50 cursor-not-allowed"}`}
              >
                {isUploadingImage ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-surface-highlight opacity-40 mb-2" />
                    {user?.id === terrain.proprietaire_id && (
                      <span className="text-xs text-text-secondary opacity-70">Ajouter photo</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {terrain.field_images?.length >= 5 && (
            <div className="relative group cursor-pointer h-[100px] md:h-auto">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${terrain.field_images[4].url_image}')`,
                }}
              ></div>
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                <span className="text-white font-bold text-lg">
                  +{terrain.field_images.length - 5}
                </span>
              </div>
              {user?.id === terrain.proprietaire_id && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(terrain.field_images[4].url_image); }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-black/50 pointer-events-auto"
                    title="Supprimer l'image"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
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
                  <h4 className="text-lg font-semibold text-white capitalize">
                    {new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(selectedDate))}
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
                  {Array.from({ length: 30 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(new Date().getDate() + i);
                    const iso = d.toISOString().split("T")[0];
                    const isActive = iso === selectedDate;
                    
                    return (
                      <button
                        key={iso}
                        onClick={() => setSelectedDate(iso)}
                        className={`aspect-square rounded-full flex flex-col items-center justify-center text-sm ${
                          isActive
                            ? "bg-primary text-[#231a10] font-bold shadow-lg shadow-primary/20 scale-110"
                            : "text-white hover:bg-surface-light border border-transparent"
                        }`}
                      >
                        <span className="text-[10px] opacity-70 mb-0.5">{AvailabilityService.getDayShortName(d.getDay())}</span>
                        <span>{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots for selected day */}
                <div className="border-t border-surface-light pt-6">
                  <p className="text-sm text-text-secondary mb-4">
                    Créneaux disponibles pour le{" "}
                    <span className="text-white font-medium">{new Date(selectedDate).getDate()} {new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(selectedDate))}</span> :
                  </p>
                  
                  {loadingSlots ? (
                    <div className="flex justify-center py-4">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-text-secondary italic text-sm py-2">Aucun créneau disponible</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`
                            px-4 py-2 rounded-lg text-sm transition-colors border
                            ${
                              !slot.available
                                ? "bg-surface-light text-text-secondary line-through opacity-50 cursor-not-allowed border-transparent"
                                : selectedTimeSlot === slot.time
                                  ? "bg-primary text-[#231a10] font-bold shadow-md border-primary"
                                  : "bg-surface-light text-white hover:bg-primary hover:text-surface-dark border-transparent hover:border-primary"
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
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
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbLGJqOpXHjL8jpfJumhVPzQTB1zcbHVRLSLpcHNT8J_qIzQfQtzRLFNnpn10TA1erIVIykEdXj0V39lQdaldkSfvw4HES2GII-rtPiyqQL1SBn3QPezjd_RtKPNKzN-QaAo3kiP1wVXOo8kpPCC7mmbJ_FjbRTOHRiKkJMFHCTTuuSH6MApooFYQuuXJxYXNH2DU9ffIFa0jTB-LI3wGY2KFH9leereTlEg9WFDM7ThvpqdzbDd15dZGrungybq8AglZRw6YZ_Q')",
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
                    {(terrain.price_per_hour || terrain.price || 0).toLocaleString()} FCFA
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
                    <span className="text-white font-medium capitalize">
                      {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedDate))}
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
                      {selectedTimeSlot ? selectedTimeSlot : <span className="text-text-secondary/70 italic text-xs">A sélectionner</span>}
                    </span>
                  </div>
                  <Clock className="text-primary w-5 h-5" />
                </div>
              </div>
              {/* Breakdown */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-text-secondary text-sm">
                  <span>{(terrain.price_per_hour || terrain.price || 0).toLocaleString()} x 1 heure</span>
                  <span>{(terrain.price_per_hour || terrain.price || 0).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-text-secondary text-sm">
                  <span>Frais de service</span>
                  <span>1 000 FCFA</span>
                </div>
                <div className="h-px bg-surface-light my-2"></div>
                <div className="flex justify-between text-white font-bold text-base">
                  <span>Total</span>
                  <span>{((terrain.price_per_hour || terrain.price || 0) + 1000).toLocaleString()} FCFA</span>
                </div>
              </div>
              {/* CTA */}               <div className="p-4 bg-surface-dark border-t border-surface-highlight">
                <button
                  onClick={() => setIsReservationOpen(true)}
                  className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg hover:shadow-primary/20 shadow-primary/20 flex flex-col items-center"
                >
                  <span className="text-base sm:text-lg">
                    Réserver ce terrain
                  </span>
                  <span className="text-xs font-medium opacity-90 mt-0.5">
                    Paiement sécurisé par Wave
                  </span>
                </button>
              </div>   
              <p className="text-center text-xs text-text-secondary mt-4">
                Aucun débit immédiat. Annulation gratuite jusqu'à 24h avant.
              </p>
            </div>
          </div>
        </div>
      </main>
      {isReservationOpen && (
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
          stadium={stadiumDataForModal}
          initialDate={selectedDate}
          initialTimeSlot={selectedTimeSlot}
        />
      )}
    </div>
  );
}
