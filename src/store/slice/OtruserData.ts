import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* -------------------------------------------------------------------------- */
/* 🧠 1️⃣ State Definition */
/* -------------------------------------------------------------------------- */
interface JobData {
  jobTitle: string;
  jobCategory: string;
  fee: number;
}

interface ApplicationData {
  job: JobData;
  otrasId: string;
  center: string;
}

interface UserState {
  otrNumber: string | null;
  paymentData: ApplicationData | null;
}

/* -------------------------------------------------------------------------- */
/* 🚀 2️⃣ Initial State */
/* -------------------------------------------------------------------------- */
const initialState: UserState = {
  otrNumber: localStorage.getItem("otrNumber") ? localStorage.getItem("otrNumber") : 'AP25548509',
  paymentData: null,
};

/* -------------------------------------------------------------------------- */
/* ⚙️ 3️⃣ Slice Definition */
/* -------------------------------------------------------------------------- */
const otrSlice = createSlice({
  name: "otr",
  initialState,
  reducers: {
    setOtrData: (state, action: PayloadAction<Partial<UserState>>) => {
      if (action.payload.otrNumber !== undefined && action.payload.otrNumber !== null) {
        state.otrNumber = String(action.payload.otrNumber);
        localStorage.setItem("otrNumber", state.otrNumber);
      }
    },

    setOtrNumber: (state, action: PayloadAction<string | null>) => {
      state.otrNumber = action.payload;
      if (action.payload) {
        localStorage.setItem("otrNumber", action.payload);
      } else {
        localStorage.removeItem("otrNumber");
      }
    },

    clearUserData: (state) => {
      state.otrNumber = null;
      state.paymentData = null;
      localStorage.removeItem("otrNumber");
      localStorage.removeItem("userotrData");
    },

    // ✅ NEW: Store full payment/application data
    setPaymentData: (state, action: PayloadAction<ApplicationData | null>) => {
      state.paymentData = action.payload;
      if (action.payload) {
        localStorage.setItem("userotrData", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("userotrData");
      }
    },
  },
});

/* -------------------------------------------------------------------------- */
/* 📦 4️⃣ Exports */
/* -------------------------------------------------------------------------- */
export const { setOtrData, setOtrNumber, clearUserData, setPaymentData } = otrSlice.actions;
export default otrSlice.reducer;
