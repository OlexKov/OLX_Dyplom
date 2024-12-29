import { Avatar, Divider } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Images } from "../../../constants/images";
import { AdminSideBarMenu } from "../menu";
import { IUser } from "../../../models/account";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getUser } from "../../../store/slices/userSlice";
import { APP_ENV } from "../../../constants/env";
import './sidebar.scss'


export const SideBar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const user: IUser | null = useSelector((state: RootState) => getUser(state))
    return (
      <Sider width={288} theme='dark' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="flex flex-col">
          <div className={` flex p-3 gap-5 ${collapsed ? ' justify-center' : ''} items-center overflow-hidden user-container`}>
            <Avatar className=" flex-shrink-0" size={collapsed ? 46 : 84} src={user ? APP_ENV.IMAGES_100_URL + user.photo : Images.noImage} />
            {!collapsed &&
              <div className="flex flex-col gap-1">
                <span className='flex-shrink-0 font-bold text-lg text-nowrap'>{user?.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user?.email }</span>
                <span className=" animate-pulse text-green-400">Online</span>
              </div>}
          </div>
          {!collapsed &&
            <>
              <h3 className="font-bold text-xl py-4 pl-[30px]">Основне меню</h3>
              <Divider type="horizontal" variant="solid" className="border-red-400 m-0 p-0 mb-7" />
            </>}
        </div>
        <AdminSideBarMenu />
      </Sider>)
  }