'use client'

import { TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DateReserve from "./DateReserve";
import { deleteWorkshop, saveWorkshop } from "@/libs/workshopActions";

export default function WorkshopForm({ workshop }: { workshop?: WorkshopItem }) {
    const [date, setDate] = useState<Dayjs | null>(workshop ? dayjs(workshop.workshopDate.slice(0, 10)) : null);
    const [busy, startTransition] = useTransition();
    const router = useRouter();
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        if (!date?.isValid() || date.format("YYYY-MM-DD") < new Date().toISOString().slice(0, 10)) { alert("Please choose today or a future date."); return; }
        startTransition(async () => {
            try {
                const result = await saveWorkshop({
                    name: String(form.get("name")).trim(),
                    description: String(form.get("description")).trim(),
                    instructor: String(form.get("instructor")).trim(),
                    workshopDate: date.format("YYYY-MM-DD"),
                    location: String(form.get("location")).trim(),
                    capacity: Number(form.get("capacity")),
                }, workshop?._id);
                if (!result.success) { alert(result.error); return; }
                router.push("/workshop");
                router.refresh();
            } catch { alert("Cannot save workshop. Please try again."); }
        });
    }
    function remove() {
        if (!workshop || !confirm("Delete this workshop? Registration history will remain.")) return;
        startTransition(async () => {
            try {
                const result = await deleteWorkshop(workshop._id);
                if (!result.success) { alert(result.error); return; }
                router.push("/workshop");
                router.refresh();
            } catch { alert("Cannot delete workshop. Please try again."); }
        });
    }
    return (
        <form className="w-full min-h-[calc(100vh-50px)] flex flex-col justify-center items-center py-10 px-4 bg-slate-500" onSubmit={submit}>
            <fieldset disabled={busy} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-5">
                <div className="text-2xl font-bold text-gray-800 text-center">{workshop ? "Edit Workshop" : "Create Workshop"}</div>
                <TextField variant="standard" name="name" label="Workshop Name" defaultValue={workshop?.name} required />
                <TextField variant="standard" name="description" label="Description" defaultValue={workshop?.description} multiline required />
                <TextField variant="standard" name="instructor" label="Instructor" defaultValue={workshop?.instructor} required />
                <DateReserve initialDate={workshop?.workshopDate} onDateChange={setDate} />
                <TextField variant="standard" name="location" label="Location" defaultValue={workshop?.location} required />
                <TextField variant="standard" name="capacity" label="Capacity" type="number" defaultValue={workshop?.capacity ?? 1} slotProps={{ htmlInput: { min: 1, step: 1 } }} required />
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg disabled:opacity-50" type="submit">{busy ? "Saving…" : "Save Workshop"}</button>
                {workshop && <button className="text-red-600" type="button" onClick={remove}>Delete Workshop</button>}
            </fieldset>
        </form>
    );
}
