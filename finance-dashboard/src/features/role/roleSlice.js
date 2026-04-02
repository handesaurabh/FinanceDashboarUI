import { createSlice } from "@reduxjs/toolkit";

const allowedRoles = new Set(["admin", "viewer"]);

const roleSlice = createSlice({
  name: "role",
  initialState: {
    currentRole: "admin",
  },
  reducers: {
    setRole(state, action) {
      if (allowedRoles.has(action.payload)) {
        state.currentRole = action.payload;
      }
    },
  },
});

export const { setRole } = roleSlice.actions;
export const selectCurrentRole = (state) => state.role.currentRole;
export default roleSlice.reducer;
