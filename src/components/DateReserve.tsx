'use client'

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

export default function DateReserve({ onDateChange, initialDate } : { onDateChange: (value: Dayjs | null) => void; initialDate?: string }) {

    const [reserveDate, setReserveDate] = useState<Dayjs|null>(initialDate ? dayjs(initialDate.slice(0, 10)) : null);

    return (
        <div className="w-full flex justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className="w-full" label="Workshop Date" minDate={dayjs(new Date().toISOString().slice(0, 10))}
                value={reserveDate}
                onChange={(value) => { setReserveDate(value); onDateChange(value);}}
                />
            </LocalizationProvider>
        </div>
    );
}