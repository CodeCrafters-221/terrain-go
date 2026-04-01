import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateField() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    proprietaire_id: profile?.id,
    description: "",
    adress: "",
    pelouse: "",
    capacity: 0,
    price_per_hour: 0,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur du champ en cours de modification
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (
      formData.name == "" ||
      formData.description == "" ||
      formData.pelouse == "" ||
      formData.adress == "" ||
      formData.capacity == "" ||
      formData.price_per_hour == ""
    ) {
      validationErrors.name = "Ce champ est requis !";
    }

    if (formData.capacity > 11 || formData.capacity < 6) {
      validationErrors.capacity =
        "La capacité du terrain doit etre en 6 (6x6) et 11 (11x11)";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);

      const { error } = await supabase.from("fields").insert({
        name: formData.name,
        proprietaire_id: profile?.id,
        description: formData.description,
        adress: formData.adress,
        pelouse: formData.pelouse,
        capacity: formData.capacity,
        price_per_hour: formData.price_per_hour,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Terrain créé !");
      navigate("/create-field-details");
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur, réessaie plus tard");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors`;

  return (
    <div className="bg-[#2e2318] rounded-2xl w-3xl shadow-2xl border border-surface-highlight">
      <div className="p-6 sm:p-8">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Ajout de Terrain
        </h2>

        <form
          onSubmit={handleSubmit}
          method="POST"
          className="grid grid-cols-2 gap-5"
        >
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-text-secondary text-sm">
              Nom du terrain
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Terrain DSC"
              value={formData.name}
              onChange={handleInputChange}
              className={`${inputClasses} ${errors.name ? "border-red-500" : "border-surface-highlight"}`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">{errors.name}</span>
            )}
          </div>

          {/* description */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-text-secondary text-sm"
            >
              Description
            </label>
            <textarea
              type="number"
              id="description"
              name="description"
              placeholder="Parlez nous de votre terrain..."
              value={formData.description}
              onChange={handleInputChange}
              className={`${inputClasses} ${errors.description ? "border-red-500" : "border-surface-highlight"}`}
            />
            {errors.description && (
              <span className="text-red-500 text-xs">{errors.description}</span>
            )}
          </div>

          {/* adress */}
          <div className="flex flex-col gap-1">
            <label htmlFor="adress" className="text-text-secondary text-sm">
              Adresse
            </label>
            <div className="relative">
              <input
                type="text"
                id="adress"
                name="adress"
                placeholder="Dakar Sacré Coeur"
                value={formData.adress}
                onChange={handleInputChange}
                className={`${inputClasses} ${errors.adress ? "border-red-500" : "border-surface-highlight"}`}
              />
            </div>
            {errors.adress && (
              <span className="text-red-500 text-xs">{errors.adress}</span>
            )}
          </div>

          {/* pelouse */}
          <div className="flex flex-col gap-1">
            <label htmlFor="pelouse" className="text-text-secondary text-sm">
              Pelouse
            </label>

            <div className="relative">
              <select
                id="pelouse"
                name="pelouse"
                value={formData.pelouse}
                onChange={handleInputChange}
                className={`${inputClasses}
                                    appearance-none
                                    pr-10
                                    ${errors.pelouse ? "border-red-500" : "border-surface-highlight"}
                                    bg-transparent
                                `}
              >
                <option value="" className="text-black">
                  Choisir le type de pelouse
                </option>
                <option value="synthetique" className="text-black">
                  Synthétique
                </option>
                <option value="gazon" className="text-black">
                  Gazon
                </option>
                <option value="hybride" className="text-black">
                  Hybride (gazon - synthétique)
                </option>
              </select>

              {/* Icône custom (corrige le padding visuel) */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {errors.pelouse && (
              <span className="text-red-500 text-xs">{errors.pelouse}</span>
            )}
          </div>

          {/* capacity */}
          <div className="flex flex-col gap-1">
            <label htmlFor="capacity" className="text-text-secondary text-sm">
              Capacité du terrain
            </label>

            <div className="relative">
              <select
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className={`${inputClasses}
                                    appearance-none
                                    pr-10
                                    ${errors.capacity ? "border-red-500" : "border-surface-highlight"}
                                    bg-transparent
                                `}
              >
                <option value="">Choisir la capacité</option>
                <option value={5}>5 x 5</option>
                <option value={6}>6 x 6</option>
                <option value={7}>7 x 7</option>
                <option value={8}>8 x 8</option>
                <option value={9}>9 x 9</option>
                <option value={11}>11 x 11</option>
              </select>

              {/* Icône custom (corrige le padding visuel) */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {errors.capacity && (
              <span className="text-red-500 text-xs">{errors.capacity}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label htmlFor="capacity" className="text-text-secondary text-sm">
              Prix / Heure
            </label>
            <div className="relative">
              <input
                type="number"
                id="price_per_hour"
                name="price_per_hour"
                placeholder="Ex: 20000"
                onChange={handleInputChange}
                className={`${inputClasses} ${errors.price_per_hour ? "border-red-500" : "border-surface-highlight"}`}
              />
            </div>
            {errors.price_per_hour && (
              <span className="text-red-500 text-xs">
                {errors.price_per_hour}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/3 mx-auto col-span-2 bg-primary text-black font-semibold py-3 rounded-lg hover:bg-primary/90 transition-opacity mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Ajout..." : "Ajouter mon terrain"}
          </button>
        </form>
      </div>
    </div>
  );
}
