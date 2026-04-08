import { useCallback } from "react";
import { TerrainService } from "../../services/TerrainService";

export const useFieldActions = (dispatch, refreshData) => {
  const addField = useCallback(
    async (formData, imageFile) => {
      const newField = await TerrainService.createTerrain(formData, imageFile);
      const mapped = TerrainService._mapTerrain(newField);

      dispatch({ type: "ADD_FIELD", payload: mapped });
      return true;
    },
    [dispatch],
  );

  const updateField = useCallback(
    async (id, formData, imageFile) => {
      await TerrainService.updateTerrain(id, formData, imageFile);
      await refreshData();
      return true;
    },
    [refreshData],
  );

  const deleteField = useCallback(
    async (id) => {
      await TerrainService.deleteTerrain(id);
      dispatch({ type: "DELETE_FIELD", payload: id });
    },
    [dispatch],
  );

  return { addField, updateField, deleteField };
};
