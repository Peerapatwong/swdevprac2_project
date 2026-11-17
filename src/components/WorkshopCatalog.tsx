import Card from "./Card";

export default function WorkshopCatalog({ workshopsJson }: { workshopsJson: WorkshopJson }) {
    return (
        <div className="flex flex-col w-full gap-5">
            <div className="flex flex-auto flex-row flex-wrap justify-around align-around m-5 w-full">
                {workshopsJson.data.length === 0 && <p>No Workshops Found</p>}
                {workshopsJson.data.map((workshop: WorkshopItem) => (
                    <Card key={workshop._id} workshopName={workshop.name} imgSrc="/img/banner.jpg" wid={workshop._id} />
                ))}
            </div>
        </div>
    );
}
