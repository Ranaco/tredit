import * as React from "react";
import type { NextRouter } from "next/router";
import { pacifico } from "./layout/main";
import { GoHomeFill } from "react-icons/go";
import { TbCategoryFilled } from "react-icons/tb";
import { MdNotificationsActive } from "react-icons/md";
import { BsFillGearFill } from "react-icons/bs";
import { IconType } from "react-icons";
import { AiTwotoneEdit } from "react-icons/ai";
import { Avatar, AvatarIcon, Tooltip } from "@nextui-org/react";
import { useAppContext } from "@/pages/_app";

interface SidebarProps {
  router: NextRouter;
}

interface IconProps {
  icon: IconType;
  title: string;
  onClick: (val: string) => void;
  path: string;
  activePath: string;
}

const IconButton: React.FC<IconProps> = ({
  icon: Icon,
  title,
  onClick,
  path,
  activePath,
}) => {
  const active: boolean = activePath.includes(path.substring(0, 6));
  return (
    <div
      className={`flex flex-col gap-4 items-center cursor-pointer z-10 ${
        active ? "text-black" : "text-gray-300"
      }`}
      onClick={() => onClick(path)}
    >
      <Icon size={"17px"} />
      <span className="text-sm">{title}</span>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ router }) => {
  const { state } = useAppContext();

  const navigate = (route: string): void => {
    router.push(route);
  };

  return (
    <div className="h-full w-20 flex flex-col gap-12 items-center pt-4 bg-white">
      <span className={`${pacifico.className} text-2xl`}>TE.</span>
      <div className="flex flex-col gap-8 w-full items-center">
        <IconButton
          icon={GoHomeFill}
          onClick={(val: string) => navigate(val)}
          title="Home"
          path="/home"
          activePath={router.pathname}
        />
        <IconButton
          icon={AiTwotoneEdit}
          onClick={(val: string) => navigate(val)}
          title="Editor"
          path={`/editor/${
            state.trexts && state.trexts.length > 0 ? state.trexts[0].id : 0
          }`}
          activePath={router.pathname}
        />
        <IconButton
          icon={TbCategoryFilled}
          onClick={(val: string) => navigate(val)}
          title="Category"
          path="/category"
          activePath={router.pathname}
        />
      </div>

      <div className="mt-auto mb-10 flex flex-col w-auto items-center gap-8">
        <Tooltip content="Notifications" placement={"right"}>
          <div>
            <MdNotificationsActive
              className="cursor-pointer"
              size={"25px"}
              onClick={() => {
                console.log("Notifcation onClick");
              }}
            />
          </div>
        </Tooltip>
        <Tooltip content="Settings" placement={"right"}>
          <div>
            <BsFillGearFill
              className="cursor-pointer"
              size={"20px"}
              onClick={() => router.push("/settings")}
            />
          </div>
        </Tooltip>
        <Tooltip content="Profile" placement={"right"}>
          <Avatar
            className="cursor-pointer"
            onClick={() => router.push("/profile")}
            src={state.user ? state.user.user_metadata.avatar_url : ""}
            icon={state.user ? undefined : <AvatarIcon />}
            classNames={{
              icon: "text-black/80",
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
