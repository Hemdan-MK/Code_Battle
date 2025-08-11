// redux/chatSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutThunk } from "./thunk";

const initialState = {
    individual: {}, match: {},
     error: null, // Add this to your initial state
    loading: false, // Add this too if you don't have it };
}
    const chatSlice = createSlice({
        name: "chat",
        initialState,
        reducers: {
            /* ───────────── Individual chat ───────────── */
            addIndividualMessage: (state, action) => {
                const { partnerId, msg } = action.payload;
                if (!state.individual[partnerId]) {
                    state.individual[partnerId] = [];
                }
                state.individual[partnerId].push(msg);
            },
            clearIndividualChat: (state, action) => {
                const { partnerId } = action.payload;
                if (state.individual[partnerId]) {
                    state.individual[partnerId] = [];
                }
            },
            // Add these new reducers
            setError: (state, action) => {
                state.error = action.payload;
                state.loading = false;
            },
            clearError: (state) => {
                state.error = null;
            },
            setLoading: (state, action) => {
                state.loading = action.payload;
            },

            /* ───────────── Match chat ───────────── */
            addMatchMessage: (
                state,
                action
                // : PayloadAction<{
                //     matchId: string;
                //     channel: "team" | "all";
                //     msg: Message;
                // }>
            ) => {
                const { matchId, channel, msg } = action.payload;
                // ensure object exists
                state.match[matchId] = state.match[matchId] || { team: [], all: [] };
                state.match[matchId][channel].push(msg);
            },
            clearMatchChat: (state, action: PayloadAction<{ matchId: string }>) => {
                delete state.match[action.payload.matchId];
            },

            /* ───────────── Utility ───────────── */
            clearAllChats: () => initialState,
        },

        /* ───────────── Reset slice automatically when logout succeeds ───────────── */
        extraReducers: (builder) =>
            builder.addCase(logoutThunk.fulfilled, () => initialState),
    });

    export const {
        addIndividualMessage,
        clearIndividualChat,
        addMatchMessage,
        clearMatchChat,
        setError,
        setLoading,
        clearAllChats,
    } = chatSlice.actions;

    export default chatSlice.reducer;
