'use client'

import DateReserve from "@/components/DateReserve";
import { AppDispatch } from "@/redux/store";
import { MenuItem, Select, TextField } from "@mui/material";
import { Dayjs } from "dayjs";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { addBooking } from "@/redux/features/bookSlice"

export default function BookingForm() {
    
    const [name, setName] = useState<string>();
    const [contact, setContact] = useState<string>();
    const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
    const [venue, setVenue] = useState<string>("Bloom");

    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name || !contact || !reserveDate || !venue) {
            alert("Please fill the form");
            return;
        }

        const item: BookingItem = {
            nameLastname: name,
            tel: contact,
            venue,
            bookDate: reserveDate.format("YYYY/MM/DD"),
        };

        dispatch(addBooking(item));
        alert("Booked!");
    };

    return (
        <form className="w-full min-h-[calc(100vh-50px)] flex flex-col gap-y-5 justify-center items-center py-10 px-4 bg-slate-500"
        onSubmit={handleSubmit}>
            
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8 space-y-6">
                <div className="text-2xl font-bold text-gray-800 text-center">
                    Venue Booking
                </div>

                <div className="w-full flex flex-col space-y-4">
                    <TextField 
                        variant="standard" 
                        name="Name-Lastname" 
                        label="Name-Lastname" 
                        className="w-full"
                        onChange={(event) => {setName(event.target.value);}}
                        required
                    />
                    <TextField 
                        variant="standard" 
                        name="Contact-Number" 
                        label="Contact-Number" 
                        className="w-full"
                        onChange={(event) => {setContact(event.target.value);}}
                        required
                    />
                </div>

                <div className="w-full">
                    <Select 
                        variant="standard" 
                        id="venue" 
                        defaultValue="Bloom"
                        className="w-full text-left"
                        onChange={(event) => {setVenue(event.target.value);}}
                    >
                        <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
                        <MenuItem value="Spark">Spark Space</MenuItem>
                        <MenuItem value="GrandTable">The Grand Table</MenuItem>
                    </Select>
                </div>

                <div className="w-full">
                    <DateReserve onDateChange={(value:Dayjs | null) => {setReserveDate(value);}} />
                </div>

                <button 
                type="submit" 
                name="Book Venue"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer"
                >
                    Book Venue
                </button>
            </div>
        </form>
    );
}
