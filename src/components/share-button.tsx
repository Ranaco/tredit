import * as React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalBody,
  Card,
  CardBody,
  Badge,
  Avatar,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { BsShareFill } from "react-icons/bs";
import type { SupabaseUser, Trext } from "@/lib/types";
import SupabaseDB from "@/lib/supabase-client";

interface ShareButtonProps {
  docId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ docId }) => {
  const [searchVal, setSearchVal] = React.useState<string>("");
  const [userRes, setUserRes] = React.useState<SupabaseUser[]>([]);
  const [searchedUsers, setSearchedUsers] = React.useState<SupabaseUser[]>([]);
  const supabaseDB = new SupabaseDB();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [payloads, setPayloads] = React.useState<SupabaseUser[]>([]);
  const [sharedTrexts, setSharedTrexts] = React.useState<Trext[]>([]);

  const searchUsers = React.useCallback(async () => {
    const matchingUsers = userRes.filter((user) =>
      user.name.toLowerCase().includes(searchVal.toLowerCase()),
    );

    setSearchedUsers(matchingUsers);
  }, [searchVal]);

  const fetchUsers = async () => {
    const data = await supabaseDB.read<SupabaseUser[]>("", "", {
      table: "User",
    });
    setSearchedUsers(data);
    setUserRes(data);
  };

  const share = async (id: string) => {
    const supabaseDB: SupabaseDB = new SupabaseDB();

    try {
      const user: SupabaseUser[] = await supabaseDB.read<SupabaseUser[]>(
        "id",
        id,
        {
          table: "User",
        },
      );

      const trext: Trext[] = await supabaseDB.read<Trext[]>("id", docId);

      const userPayload: SupabaseUser = {
        ...user[0],
        collaborating: [...(user[0].collaborating || []), docId].filter(
          function (elem, index, self) {
            return index === self.indexOf(elem);
          },
        ),
      };

      const trextPayload: Trext = {
        ...trext[0],
        collaboraters: [...(trext[0].collaboraters || []), id].filter(
          function (elem, index, self) {
            return index === self.indexOf(elem);
          },
        ),
      };

      setSharedTrexts([...sharedTrexts, trextPayload]);
      setPayloads([...payloads, userPayload]);
    } catch (err) {
      console.error(err);
    }
  };

  const done = async () => {
    const supabaseDB: SupabaseDB = new SupabaseDB();

    for (let i = 0; i < payloads.length; i++) {
      await supabaseDB.update("id", payloads[i].id, payloads[i], {
        table: "User",
      });

      await supabaseDB.update("id", sharedTrexts[i].id!, sharedTrexts[i]);
    }

    onCloseModal();
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const onCloseModal = () => {
    onClose();
    setSearchVal("");
  };
  return (
    <>
      <Button variant="flat" onClick={onOpen}>
        <BsShareFill />
        Share
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="fixed"
      >
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
                      <Card key={user.id}>
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
                            onClick={() => share(user.id)}
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
                <Button onClick={done} variant="flat">
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareButton;
