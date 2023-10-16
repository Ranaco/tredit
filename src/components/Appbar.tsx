import * as React from "react";
import {
  Card,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  Input,
  Badge,
  Avatar,
  ModalFooter,
  ModalHeader,
  CardBody,
  useDisclosure,
} from "@nextui-org/react";
import { BsCheck2, BsShareFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import SupabaseDB from "@/lib/supabase-client";
import { SupabaseUser } from "@/lib/types";

interface AppBarProps {
  title: string;
  editTitle: boolean;
  setEditTitle: (val: boolean) => void;
  setShowBar: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (val: string) => void;
}

const AppBar: React.FC<AppBarProps> = ({
  title,
  editTitle,
  setEditTitle,
  setShowBar,
  onChange,
}) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [searchVal, setSearchVal] = React.useState<string>("");
  const [userRes, setUserRes] = React.useState<SupabaseUser[]>([]);
  const [searchedUsers, setSearchedUsers] = React.useState<SupabaseUser[]>([]);
  const supabaseDB = new SupabaseDB();

  const searchUsers = async () => {
    const matchingUsers = userRes.filter((user) =>
      user.name.toLowerCase().includes(searchVal.toLowerCase()),
    );

    setSearchedUsers(matchingUsers);
  };

  const fetchUsers = async () => {
    const data = await supabaseDB.read<SupabaseUser[]>("", "", {
      table: "User",
    });
    setSearchedUsers(data);
    setUserRes(data);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const onCloseModal = () => {
    onClose();
    setSearchVal("");
  };

  return (
    <Card
      className="w-full h-12 flex flex-row items-center px-4 gap-10 justify-between"
      radius="none"
      shadow="none"
    >
      <div className="flex flex-row gap-4 items-center h-12 w-auto">
        <Button
          isIconOnly
          variant="flat"
          onClick={() => setShowBar((val: boolean) => !val)}
        >
          <HiOutlineMenuAlt1 className="text-2xl" />
        </Button>
        <div className="flex flex-row w-auto h-full items-center gap-2">
          <input
            className="w-auto h-full flex items-center flex-row justify-start border-none overflow-ellipsis"
            disabled={!editTitle}
            value={title}
            name={title}
            onChange={(e) => onChange(e.target.value)}
          />

          <Button isIconOnly variant="flat">
            {editTitle ? (
              <BsCheck2 onClick={() => setEditTitle(false)} />
            ) : (
              <MdEdit onClick={() => setEditTitle(true)} />
            )}
          </Button>
        </div>
      </div>
      <Button variant="flat" onClick={onOpen}>
        <BsShareFill />
        Share
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="fixed">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Share</ModalHeader>
              <ModalBody>
                <Input
                  value={searchVal}
                  placeholder="Search..."
                  name="search"
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    searchUsers();
                  }}
                />
                <div className="flex flex-col gap-3">
                  {searchedUsers.map((user) => {
                    return (
                      <Card id={user.id}>
                        <CardBody className="flex flex-row items-center justify-between px-3">
                          <div className="flex flex-row gap-4 items-center">
                            <Badge content={""} shape="circle">
                              <Avatar src={user.avatar_url} radius="full" />
                            </Badge>
                            <span className="font-bold">{user.name}</span>
                          </div>
                          <Button
                            variant="flat"
                            color="primary"
                            onClick={() => {}}
                          >
                            Share
                          </Button>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onCloseModal} variant="flat">
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default AppBar;
