import * as React from "react";
import { BsChevronRight } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import NoteWidget from "@/components/note-widget";
import dynamic from "next/dynamic";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { Context } from "@/pages/_app";
import SupabaseDB from "@/lib/supabase-client";

const Editor = dynamic(() => import("@/lib/editor"), { ssr: false });

const Home: React.FC = () => {
  const router = useRouter();
  const [data, setData] = React.useState<OutputData>();
  const [instance, setInstance] = React.useState<EditorJS>();
  const { state } = React.useContext(Context);
  const supabaseDB = new SupabaseDB();

  const scratchPadChange = (value: OutputData) => {
    supabaseDB.updateScratchPad(value);
  };

  const fetchScratchPad = async () => {
    if (state.user) {
      const data = await supabaseDB.read(
        "title",
        state.user.id + "-scratchpad",
      );
      setData(JSON.parse(data[0].content));
    }
  };

  React.useEffect(() => {
    fetchScratchPad();
  }, [state.user]);

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
                onClick={() => router.push(`/editor/${state.trexts[0].id}`)}
              >
                Notes&nbsp;
                <BsChevronRight />
              </Button>
            </div>
            <div className="flex flex-row gap-4 px-4 h-full">
              {state.trexts
                ? state.trexts.map((note, index) =>
                    note.title == state.user.id + "-scratchpad" ? undefined : (
                      <NoteWidget
                        id={note.id}
                        key={index}
                        title={note.title}
                        content={String(note.content).substring(0, 100)}
                      />
                    ),
                  )
                : undefined}
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
            className="h-full flex-[1] bg-gray-100/50 rounded-md p-4"
            style={{
              backdropFilter: "blur(30px)",
            }}
          >
            <div className="w-full h-16 flex items-center flex-row px-4 text-xl">
              Scratch pad
            </div>
            <Editor
              id={data?.version!}
              holder="editor"
              onChange={scratchPadChange}
              isPad
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
