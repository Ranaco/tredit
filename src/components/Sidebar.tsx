import * as React from "react";
import type { NextRouter } from "next/router";
import { pacifico } from "./layout/main";
import { GoHomeFill } from "react-icons/go";
import { TbCategoryFilled } from "react-icons/tb";
import { MdNotificationsActive } from "react-icons/md";
import { BsFillGearFill } from "react-icons/bs";
import { IconType } from "react-icons";
import { AiTwotoneEdit } from "react-icons/ai";
import {
  Avatar,
  Tooltip,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useAppContext } from "@/pages/_app";
import SupabaseDB from "@/lib/supabase-client";
import supabase from "@/lib/supabase";

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
  const { state, setState } = useAppContext();
  const supabaseDB: SupabaseDB = new SupabaseDB();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const createNewEditor = async () => {
    const [id, payload] = await supabaseDB.createNewEditor();
    setState((prev) => {
      return {
        ...prev,
        trexts: [
          {
            ...payload,
          },
          ...prev.trexts,
        ],
      };
    });

    router.push(`/editor/${id}`).then(() => {
      location.reload();
    });
  };

  const navigate = (route: string): void => {
    const isCreateNewEditor = route === "/editor/new";
    if (!isCreateNewEditor) {
      router.push(route);
    } else {
      createNewEditor();
    }
  };

  return (
    <div className="h-full w-20 flex flex-col gap-12 items-center pt-4 bg-white relative">
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
            state.trexts && state.trexts.length > 0
              ? state.trexts[0].id
              : state.sharedTrexts && state.sharedTrexts.length > 0
              ? state.sharedTrexts[0].id + "?shared=true"
              : "/editor/new"
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
              onClick={onOpen}
            />
          </div>
        </Tooltip>
        <Modal backdrop="blur" onOpenChange={onOpenChange} isOpen={isOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Notifications</ModalHeader>
                <ModalBody>
                  <div>This is the body</div>
                </ModalBody>
                <ModalFooter>This is the footer</ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
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
            onClick={() => {
              supabase.auth.signOut().then(() => {
                window.localStorage.setItem("token", JSON.stringify(false));
                location.reload();
              });
            }}
            src={state.user ? state.user.avatar_url : ""}
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
