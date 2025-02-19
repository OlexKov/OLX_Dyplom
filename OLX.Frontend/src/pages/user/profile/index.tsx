import { Tabs, TabsProps } from "antd";
import './style.scss'
import { useGetUserQuery } from "../../../redux/api/userAuthApi";
import { useAppSelector } from "../../../redux";
import UserProfileInfo from "../../../components/user_profile_info";
import PrimaryButton from "../../../components/buttons/primary_button";
import { useNavigate } from "react-router-dom";
import ActiveAdverts from "../../../components/active_adverts";
import { useGetUserAdvertsQuery } from "../../../redux/api/advertAuthApi";



const UserProfile: React.FC = () => {
    const user = useAppSelector(state => state.user.user)
    const { data: userData } = useGetUserQuery(user?.id || 0)
    const { data: userAdverts } = useGetUserAdvertsQuery(user?.id || 0)
    const navigate = useNavigate()
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <h5 className="ml-[8vw] font-montserrat text-adaptive-card-price-text" >Мої оголошення</h5>,
            children: <ActiveAdverts adverts={userAdverts} />,
        },
        {
            key: '2',
            label: <h5 className="ml-[.5vw] font-montserrat text-adaptive-card-price-text" >Відгуки</h5>,
            children: <div className="mx-[8vw] h-[300px] bg-slate-100">Відгуки</div>,
        },
        {
            key: '3',
            label: <h5 className="ml-[.51vw] font-montserrat text-adaptive-card-price-text" >Неактивні оголошення</h5>,
            children: <div className="mx-[8vw] h-[300px] bg-slate-200">Неактивні оголошення</div>,
        },
    ];

    const operation = <PrimaryButton title="Додати" isLoading={false} onButtonClick={() => {navigate(`advert/create`)}} className="w-[8.8vw] h-[4.3vh] mr-[8vw]" brColor="#9B7A5B" bgColor="#9B7A5B" fontColor="white" fontSize="clamp(14px,1.9vh,36px)"/>;

    return (
        <div className="w-[100%] gap-[8vh] flex flex-col my-[6vh]">
            <div className="mx-[8vw] flex  items-center h-[37.5vh] ">
                <div className=" flex w-full items-center justify-between h-[27vh]" >
                    <UserProfileInfo user={userData} className="h-full" />
                    <PrimaryButton
                        onButtonClick={() => { navigate(`/user/edit`) }}
                        title='Редагувати'
                        isLoading={false}
                        fontSize="clamp(14px,1.9vh,36px)"
                        bgColor="transparent"
                        brColor="#9B7A5B"
                        fontColor="black"
                        className={` w-[11.5vw] h-[4.6vh] self-start`} />
                </div>

            </div>
            <Tabs
                className="profile-tabs hover:text-black"
                defaultActiveKey="1"
                indicator={{ size: 0 }}
                items={items} 
                tabBarExtraContent={userAdverts && userAdverts.length > 0 ? operation : undefined} />
        </div>
    )
}

export default UserProfile