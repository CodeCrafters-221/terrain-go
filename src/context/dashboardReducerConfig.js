/**
 * Configuration initiale et logique du Reducer pour le Dashboard
 */

export const initialState = {
  fields: [],
  reservations: [],
  subscriptions: [],
  loading: true,
  error: null,
};

export function dashboardReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        fields: action.payload.fields,
        reservations: action.payload.reservations,
        subscriptions: action.payload.subscriptions,
      };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "ADD_FIELD":
      return { ...state, fields: [action.payload, ...state.fields] };

    case "UPDATE_FIELD":
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === action.payload.id ? action.payload : f,
        ),
      };

    case "DELETE_FIELD":
      return {
        ...state,
        fields: state.fields.filter((f) => f.id !== action.payload),
      };

    case "UPDATE_RESERVATION_STATUS":
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.id === action.payload.id
            ? { ...r, status: action.payload.status }
            : r,
        ),
      };

    default:
      return state;
  }
}
