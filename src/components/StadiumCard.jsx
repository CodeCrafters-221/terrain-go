import React from "react";

export default function StadiumCard({
  city,
  location,
  price,
  totalPlayers,
  notes,
  fieldStadium,
  image,
  ...props
}) {
  // infos stades
  // const infoStadium = [
  //   {
  //     stadiumName: "Dakar Sacré-Cœur",
  //     price: "25000 FCFA",
  //     address: "Sacré-Cœur 3, Dakar",
  //     players: " 5 vs 5",
  //     stadiumType: "Synthétique",
  //     notes: "4.8",
  //   },
  //   {
  //     stadiumName: "Terrain Jaraf",
  //     price: "30000 FCFA",
  //     address: "Mermoz, Dakar",
  //     players: " 7 vs 7",
  //     stadiumType: "Gazon",
  //     notes: "4.9",
  //   },
  //   {
  //     stadiumName: "Temple Du Foot",
  //     price: "20000 FCFA",
  //     address: "Point E, Dakar",
  //     players: " 5 vs 5",
  //     stadiumType: "Synthétique",
  //     notes: "4.7",
  //   },
  // ];
  return (
    <div>
      <div className=" w-76 ">
        <figure className="">
          <img src={image} className="object-cover h-60 w-full rounded-2xl" />
        </figure>
        <div className="flex flex-col gap-4 p-2">
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-white text-lg font-bold group-hover:text-primary transition-colors">
              {city}
            </h3>
            <span className="text-primary font-bold ">
              {price} FCFA <span className="text-white font-normal">/h</span>
            </span>
          </div>
          <div className="flex items-start">
            <span class="material-symbols-outlined text-[#cbad90] mr-3">
              explore_nearby
            </span>
            <p className="text-[#cbad90] ">{location}</p>
          </div>

          <div className="card-details flex justify-between gap-4 items-center">
            <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#342618] text-[#cbad90] rounded-2xl">
              {totalPlayers}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#342618] text-[#cbad90] rounded-2xl">
              {fieldStadium}
            </div>
            <div className="  bg-black/40 backdrop-blur-md px-2 py-1 rounded-4xl tracking-wider text-white text-[10px] font-bold flex items-center">
              <span
                className="material-symbols-outlined text-primary mr-1"
                style={{ fontSize: "14px" }}
              >
                star
              </span>
              {notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
