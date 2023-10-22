import * as React from "react";
import { Card, Button } from "@nextui-org/react";
import { BsCheck2 } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import ShareButton from "./share-button";

interface AppBarProps {
  docId: string;
  title: string;
  editTitle: boolean;
  setEditTitle: (val: boolean) => void;
  setShowBar: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (val: string) => void;
}

const AppBar: React.FC<AppBarProps> = ({
  docId,
  title,
  editTitle,
  setEditTitle,
  setShowBar,
  onChange,
}) => {
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
      <ShareButton docId={docId} />
    </Card>
  );
};

export default AppBar;
