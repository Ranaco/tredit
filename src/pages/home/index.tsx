import * as React from "react";
import { BsChevronRight } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import NoteWidget from "@/components/note-widget";
import dynamic from "next/dynamic";
import EditorJS, { OutputData } from "@editorjs/editorjs";

const Editor = dynamic(() => import("@/lib/editor"), { ssr: false });

const Home: React.FC = () => {
  const router = useRouter();
  const [data, setData] = React.useState<OutputData>();
  const [instance, setInstance] = React.useState<EditorJS>();

  const notesDataList = [
    {
      title: "Note 1",
      content: "lorem ipsum dolor sit amet",
      id: "1",
    },
    {
      title: "Note 2",
      content: "lorem ipsum dolor sit amet",
      id: "2",
    },
    {
      title: "Note 3",
      content: "lorem ipsum dolor sit amet",
      id: "3",
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="w-full h-full bg-blue-300 z-[-1] fixed">
        <img
          src="/images/home.jpg"
          alt="home"
          className="object-cover h-full w-full object-bottom z-[-1]"
        />
      </div>
      <div className="flex flex-col flex-1 lg:w-[97%] w-[80%] mx-auto xl:h-[80%] lg:h-[90%] h-[93%] mt-[10%] gap-5">
        <span className="text-4xl font-bold text-white">Hello there</span>
        <div className="flex lg:flex-row flex-col w-full h-[40%] gap-5 flex-1">
          <div
            className="h-full flex-[1.5] bg-gray-100/50 rounded-md flex flex-col gap-4 py-4 overflow-x-auto"
            style={{
              backdropFilter: "blur(30px)",
            }}
          >
            <div className="w-full h-16 flex items-center flex-row px-4">
              <Button
                onClick={() => router.push(`/editor/${notesDataList[0].id}`)}
              >
                Notes&nbsp;
                <BsChevronRight />
              </Button>
            </div>
            <div className="flex flex-row gap-4 px-4 h-full">
              {notesDataList.map((note, index) => (
                <NoteWidget
                  id={note.id}
                  key={index}
                  title={note.title}
                  content={note.content}
                />
              ))}
              <div
                className="w-[250px] h-full flex flex-col gap-2 bg-white/10 p-4 rounded-xl items-center justify-center"
                style={{
                  backdropFilter: "blur(10px)",
                }}
              >
                <Button isIconOnly>
                  <AiOutlinePlus />
                </Button>
              </div>
            </div>
          </div>
          <div
            className="h-full flex-[1] bg-gray-100/50 rounded-md"
            style={{
              backdropFilter: "blur(30px)",
            }}
          >
            <div className="w-full h-16 flex items-center flex-row px-4 text-xl">
              Scratch pad
            </div>
            <Editor
              holder="editor"
              onChange={console.log}
              isPad
              data={data}
              setInstance={setInstance}
            />
          </div>
        </div>
        <div
          className="flex-[1] bg-gray-100/50 rounded-md"
          style={{
            backdropFilter: "blur(30px)",
          }}
        >
          <div className="w-full h-16 flex items-center flex-row px-4">
            Media
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
