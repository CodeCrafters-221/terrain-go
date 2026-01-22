<<<<<<< HEAD
import { Link } from "react-router";


=======
>>>>>>> dev
export default function Header() {
  return (
    <div className="header">
      <div className="flex items-center gap-2">
        <span class="material-symbols-outlined text-3xl text-primary">
          sports_soccer
        </span>
        <h2 className="text-3xl  text-white font-lexend  tracking-wider font-bold">
          Footbooking
        </h2>
      </div>
      <div className=" navigation md:flex">
        <a
          className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
          href="#"
        >
          Accueil
        </a>
        <Link
          className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
          to="/search"
        >
          Trouver un terrain
        </Link>
        <a
          className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
          href="#"
        >
          Pour les propriétaires
        </a>

        <Link to="/auth/login" className="bg-primary rounded-full font-montserrat font-semibold text-text text-lg px-4 py-2 cursor-pointer">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
