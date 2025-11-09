import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  jwt: string | null;
  userId: string | null;
  userName?: string | null;
  candidateId?: string | null;
}

const initialState: UserState = {
  jwt: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,
  userName: localStorage.getItem("userName") || null,
  candidateId: localStorage.getItem("candidateId") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Save all user data
    setUserData: (
      state,
      action: PayloadAction<{
        jwt: string;
        userId: string;
        userName: string;
        candidateId: string | null;
      }>
    ) => {
      state.jwt = action.payload.jwt;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName || null;
      state.candidateId = action.payload.candidateId || null;

      // Optional: persist in localStorage
      localStorage.setItem("token", action.payload.jwt);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("userName", action.payload.userName || "");
      localStorage.setItem("candidateId", action.payload.candidateId || "");
    },

 

    // ✅ Clear user data on logout
    clearUserData: (state) => {
      state.jwt = null;
      state.userId = null;
      state.userName = null;
      state.candidateId = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("candidateId");
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
