import { useCallback } from "react";
import { TerrainService } from "../../services/TerrainService";
import { ReservationService } from "../../services/ReservationService";

export const useDashboardData = (user, profile, dispatch) => {
  return useCallback(async () => {
    if (!user || profile?.role !== "owner") return;

    dispatch({ type: "FETCH_START" });

    try {
      const [terrains, reservations, subscriptions] = await Promise.all([
        TerrainService.getAllTerrains(),
        ReservationService.getOwnerReservations(),
        ReservationService.getOwnerSubscriptions(user.id),
      ]);

      const myFields = terrains.filter((t) => t.proprietaire_id === user.id);

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          fields: myFields,
          reservations,
          subscriptions,
        },
      });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
      throw err;
    }
  }, [user, profile, dispatch]);
};
