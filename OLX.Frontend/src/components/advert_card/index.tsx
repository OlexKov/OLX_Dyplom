import { formatPrice } from "../../utilities/common_funct";
import ToggleFavoriteButton from "../buttons/toggle_favorite_button";
import { AdvertCardProps } from "./props"
import { useNavigate } from "react-router-dom";


import AdvertButtonMenu from "../buttons/button_menu";
import { useAppSelector } from "../../redux";
import { APP_ENV } from "../../constants/env";
import { useMemo } from "react";


const AdvertCard: React.FC<AdvertCardProps> = ({ advert, isFavorite = true, isCompleted = false, className }) => {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.user.user)
    const onClick = () => {
        navigate(`/advert/${advert?.id}`)
    }

    const activeButton = useMemo(() => user?.id == advert?.userId ?
        <AdvertButtonMenu
            id={advert?.id || 0}
            className=" absolute  w-[11%] right-[0.5vw] top-[0.5vw]"
            isEdit={true}
            isComplete={!isCompleted}
            isDelete={isCompleted}
        />
        : isFavorite ?
            <ToggleFavoriteButton advertId={advert?.id || 0} className="absolute w-[3vw] right-[0.5vh] top-[0.5vh]" />
            : <></>, [advert, user])

    return (
        <div className={`rounded-bl-lg h-fit rounded-br-lg border border-[#9b7a5b]/20 p-0 relative transition-all duration-300 ease-in-out hover:border-[#9b7a5b]/80 hover:shadow-2xl ${className}`}>
            {activeButton}
            <img className=" object-contain w-[100%] aspect-[12/13]" src={APP_ENV.IMAGES_400_URL + advert?.images.find(x => x.priority === 0)?.name} />
            <div className="p-2.5 mb-[16px] mt-[16px] cursor-pointer" onClick={onClick}>
                <h4 className="font-unbounded text-[#3a211c] text-adaptive-card-price-text font-medium mb-[10px] hover:underline truncate">{advert?.title}</h4>
                <p className="text-[#3a211c] text-adaptive-card-price-text font-medium font-montserrat">{formatPrice(advert?.price || 0)} грн</p>
            </div>
            <div className="px-2.5 pt-[20px] pb-2.5 text-[#9b7a5b] flex items-center justify-start gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className=" h-[2.6vh]" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 11.88 14.12 16.19 12 18.88C9.92 16.21 7 11.85 7 9Z" fill="#9B7A5B" />
                    <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="#9B7A5B" />
                </svg>
                <p className="text-adaptive-card-price-text font-normal font-montserrat">{advert?.settlementName}</p>
            </div>
        </div>
    )
}

export default AdvertCard