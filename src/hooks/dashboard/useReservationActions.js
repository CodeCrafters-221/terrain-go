import { useCallback } from "react";
import { ReservationService } from "../../services/ReservationService";

export const useReservationActions = (dispatch) => {
  const updateReservationStatus = useCallback(
    async (id, status) => {
      await ReservationService.updateStatus(id, status);

      dispatch({
        type: "UPDATE_RESERVATION_STATUS",
        payload: { id, status },
      });
    },
    [dispatch],
  );

  return { updateReservationStatus };
};
