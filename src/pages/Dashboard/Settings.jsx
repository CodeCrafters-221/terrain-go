import Parametre from "../../sections/profile/Parametre";

const Settings = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <h1 className="text-white text-2xl md:text-3xl font-black tracking-tight">Mes Informations</h1>
                <p className="text-[#cbad90] text-sm mt-1">Gérez vos informations personnelles.</p>
            </div>
            <div className="mt-4">
                <Parametre />
            </div>
        </div>
    );
};

export default Settings;
