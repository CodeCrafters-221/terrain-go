import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { ReviewService } from "../services/ReviewService";
import { AvailabilityService } from "../services/AvailabilityService";
import { toast } from "react-toastify";

export function useTerrainData(id) {
  const [terrain, setTerrain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchTerrain = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("fields")
          .select(
            `
            *,
            field_images (url_image)
          `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        if (isActive) setTerrain(data);
      } catch (err) {
        console.error("Error fetching terrain:", err);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchTerrain();

    return () => {
      isActive = false;
    };
  }, [id]);

  return { terrain, setTerrain, isLoading };
}

export function useTerrainReviews(id, user) {
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ note: 5, commentaire: "" });
  const [reviewsPage, setReviewsPage] = useState(1);

  const fetchReviews = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewSubmit = useCallback(
    async (e) => {
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
        await fetchReviews();
        setReviewsPage(1);
      } catch (err) {
        console.error("Error submitting review:", err);
        toast.error("Erreur lors de l'ajout de l'avis");
      } finally {
        setIsSubmittingReview(false);
      }
    },
    [user, newReview, id, fetchReviews],
  );

  return {
    reviews,
    ratingStats,
    isSubmittingReview,
    newReview,
    setNewReview,
    reviewsPage,
    setReviewsPage,
    handleReviewSubmit,
  };
}

export function useAvailability(id, selectedDate) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchSlots = async () => {
      if (!id || !selectedDate) return;
      setLoadingSlots(true);
      setAvailableSlots([]);

      try {
        const slots = await AvailabilityService.getAvailableSlots(
          id,
          selectedDate,
          "1",
        );
        if (isActive) setAvailableSlots(slots);
      } catch (err) {
        console.error("Erreur disponibilité :", err);
      } finally {
        if (isActive) setLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      isActive = false;
    };
  }, [id, selectedDate]);

  return { availableSlots, loadingSlots };
}

export function useTerrainImageManager({
  user,
  terrain,
  setTerrain,
  fileInputRef,
}) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageClick = useCallback(() => {
    if (user && terrain && user.id === terrain.proprietaire_id) {
      fileInputRef.current?.click();
    }
  }, [user, terrain, fileInputRef]);

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!user || user.id !== terrain?.proprietaire_id) {
        toast.error("Non autorisé");
        return;
      }

      setIsUploadingImage(true);
      try {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("terrain-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("terrain-images").getPublicUrl(fileName);

        const { error: dbError } = await supabase.from("field_images").insert({
          terrain_id: terrain.id,
          url_image: publicUrl,
        });

        if (dbError) throw dbError;

        setTerrain((prev) => ({
          ...prev,
          field_images: [...(prev.field_images || []), { url_image: publicUrl }],
        }));
        toast.success("Image ajoutée avec succès");
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Erreur lors de l'ajout de l'image");
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [user, terrain, setTerrain, fileInputRef],
  );

  const handleDeleteImage = useCallback(
    async (imageUrl) => {
      if (!user || user.id !== terrain?.proprietaire_id) return;
      if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
        return;
      }

      try {
        const imageObj = terrain.field_images.find(
          (img) => img.url_image === imageUrl,
        );
        if (!imageObj) return;

        const urlParts = imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];

        const { error: storageError } = await supabase.storage
          .from("terrain-images")
          .remove([fileName]);

        if (storageError) {
          console.error("Storage delete error:", storageError);
        }

        const { error: dbError } = await supabase
          .from("field_images")
          .delete()
          .match({ url_image: imageUrl, terrain_id: terrain.id });

        if (dbError) throw dbError;

        setTerrain((prev) => ({
          ...prev,
          field_images: prev.field_images.filter((img) => img.url_image !== imageUrl),
        }));

        toast.success("Image supprimée");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Erreur lors de la suppression de l'image");
      }
    },
    [user, terrain, setTerrain],
  );

  return {
    isUploadingImage,
    handleImageClick,
    handleImageUpload,
    handleDeleteImage,
  };
}
