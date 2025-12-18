import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnetSocket } from "../../lib/socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export const getUser = createAsyncThunk("user/me", async (_, thunkAPI) => {
  console.log("from get user");

  try {
    const res = await axiosInstance.get("/user/me");
    console.log({ getUser: res });

    connectSocket(res.data.user);
    return res.data.user;
  } catch (error) {
    console.log("Error fetching user", error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Failed to fetch user"
    );
  }
});

export const logout = createAsyncThunk("user/sign-out", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/user/sign-out");
    disconnetSocket();
    return res;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to log out");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});
export const login = createAsyncThunk(
  "user/sign-in",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-in", data);
      console.log({ res });

      // connectSocket(res.data);
      toast.success("Logged in Successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign in");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const signUp = createAsyncThunk(
  "user/sign-up",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-up", data);
      console.log({ "signup respose": res });
      toast.success("Signed up successfully");

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign up");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigninUp: false,
    isLogginIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
  },
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.authUser;
      })
      .addCase(login.pending, (state) => {
        state.isLogginIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLogginIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLogginIn = false;
      })
      .addCase(signUp.pending, (state) => {
        state.isSigninUp = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isSigninUp = false;
        state.authUser = action.payload;
      })
      .addCase(signUp.rejected, (state) => {
        state.isSigninUp = false;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;

export default authSlice.reducer;
