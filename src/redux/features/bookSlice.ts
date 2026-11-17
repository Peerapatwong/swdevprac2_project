import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookState = {
    bookItems: BookingItem[];
    ownerId: string;
    source: string;
};

const initialState: BookState = { bookItems: [], ownerId: "", source: "" };

export const bookSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookings: (state, action: PayloadAction<BookState>) => {
            Object.assign(state, action.payload);
        },
        addBooking: (state, action: PayloadAction<BookingItem>) => {
            const index = state.bookItems.findIndex(item => item._id === action.payload._id);
            if (index !== -1) state.bookItems[index] = action.payload;
            else state.bookItems.push(action.payload);
        },
        removeBooking: (state, action: PayloadAction<BookingItem>) => {
            state.bookItems = state.bookItems.filter(item => item._id !== action.payload._id);
        }
    }
});

export const { setBookings, addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
