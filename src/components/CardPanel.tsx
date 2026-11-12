'use client'

import { useReducer } from "react";
import Card from "./Card";
import Link from "next/link";

type RatingMap = Map<string, number>;
const initialRatings: RatingMap = new Map([
    ['The Bloom Pavilion', 0],
    ['Spark Space', 0],
    ['The Grand Table', 0]
])

const mockWorkshop = [{wid: "001", name: "The Bloom Pavilion", imgSrc: "/img/bloom.jpg" },
                   {wid: "002", name: "Spark Space", imgSrc: "/img/sparkspace.jpg"},
                   {wid: "003", name: "The Grand Table", imgSrc: "/img/grandTable.jpg"}
]
    
type Action = { type: 'UPDATE_RATING'; workshopName: string; rating: number }
            | {type: 'REMOVE_WORKSHOP'; workshopName: string }

function ratingReducer(state: RatingMap, action: Action): RatingMap {
    switch(action.type) {
        case 'UPDATE_RATING': {
            const newMap = new Map(state);
            newMap.set(action.workshopName, action.rating);
            return newMap;
        }
        case 'REMOVE_WORKSHOP': {
            const newMap = new Map(state);
            newMap.delete(action.workshopName);
            return newMap;
        }
        default: return state;
    }
}

export default function CardPanel() {
    const [ratingMap, dispatch] = useReducer(ratingReducer, initialRatings);

    return(
        <div className="flex flex-col w-full gap-5">
            <div className="flex flex-auto flex-row flex-wrap justify-around align-around m-5 w-full">
                {
                    mockWorkshop.map((workshop) => (
                        <Card key={workshop.wid} wid={workshop.wid} workshopName={workshop.name} imgSrc={workshop.imgSrc}
                        onRatingChange={(rating) => dispatch({ type: 'UPDATE_RATING', workshopName: workshop.name, rating: rating ?? 0})}/>
                    ))
                }
            </div>
            
            <div className="m-5 ">
                <div className="text-lg font-bold">
                    {`Workshop List with Ratings: ${ratingMap.size} `}
                </div>
                { Array.from(ratingMap.entries()).map(([workshopName, rating]) => (
                        <div
                            key={workshopName}
                            data-testid={workshopName}
                            onClick={() => dispatch({ type: 'REMOVE_WORKSHOP', workshopName })}
                        >
                            {`${workshopName} Rating: ${rating}`}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}