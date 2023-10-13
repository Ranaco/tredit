import * as React from "react";
import { useAppContext } from "@/pages/_app";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { Trext } from "@/lib/types";
import { useRouter } from "next/router";
import { FaStickyNote } from "react-icons/fa";

interface EditorBarProps {
  showBar: boolean;
  focusId: string;
  changeFocus: (id: string) => void;
}

const EditorBar: React.FC<EditorBarProps> = ({
  showBar,
  focusId,
  changeFocus,
}) => {
  const { state } = useAppContext();
  const router = useRouter();

  return (
    <div
      className={`${
        showBar ? "w-[20%] min-w-[300px]" : "w-0 min-w-0"
      } flex-col pt-4 flex items-center p-4 transition-width duration-300 gap-4`}
    >
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="flex flex-row items-center justify-start gap-4 w-full">
          <FaStickyNote className="text-2xl" />
          <span className="text-2xl font-bold">Editor</span>
        </div>
        <span className="text-gray-500 w-full justify-start">
          {state.trexts && state.trexts.length} trexts
        </span>
      </div>
      {state.trexts && state.trexts.length > 0
        ? state.trexts.map((e: Trext) => {
            return (
              <Card
                key={e.id}
                className={`w-full ${
                  e.id == focusId ? "bg-gray-200" : "bg-white"
                }`}
                isPressable
                onClick={() => {
                  router.push(`/editor/${e.id}`);
                  changeFocus(e.id);
                }}
              >
                <CardBody className="font-bold">
                  <p>{e.title}</p>
                </CardBody>
                <CardFooter className="text-gray-500">
                  <p>{e.updated_at || e.created_at}</p>
                </CardFooter>
              </Card>
            );
          })
        : undefined}
    </div>
  );
};

export default EditorBar;
