import { MapPin, Calendar } from "lucide-react";

export default function Cta() {
  return (
    <div>
      <div className="w-full max-w-800 bg-[#342618]/80 backdrop-blur-md border border-[#684d31] p-4 rounded-full shadow-2xl mt-10 mb-10 ">
        <form className="flex flex-col md:flex-row w-full gap-2 ">
          <div className="flex flex-1 items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#684d31]">
            <MapPin className="text-text-secondary w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Quel quartier ? (ex: Mermoz)"
              className="w-full bg-transparent border-none text-white placeholder-text-secondary focus:ring-0 p-0 text-base"
            />
          </div>

          <div className="flex w-full md:w-1/4 items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#684d31]">
            <Calendar className="text-text-secondary w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Date"
              className="w-full bg-transparent border-none text-white placeholder-text-secondary focus:ring-0  p-0 text-base"
            />
          </div>
          <div>
            <button className="bg-primary rounded-full font-montserrat font-semibold text-text text-sm px-4 py-2">
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// w-full bg-transparent border-none text-white placeholder-[#cbad90]  text-base
