//index.tsx
import EditorJS, { OutputData } from "@editorjs/editorjs";
import * as React from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import EditorBar from "@/components/editor-bar";
import { Divider } from "@nextui-org/react";
import AppBar from "@/components/Appbar";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { ButtonGroup, Button, Select, SelectItem } from "@nextui-org/react";
import {
  CiAlignBottom,
  CiAlignCenterH,
  CiAlignLeft,
  CiAlignRight,
  CiTextAlignJustify,
} from "react-icons/ci";
import { BsFillClipboardFill } from "react-icons/bs";
import { LuBold, LuItalic, LuUnderline, LuStrikethrough } from "react-icons/lu";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";
import { useAppContext } from "@/pages/_app";
import { useChannel } from "ably/react";
import { Types } from "ably";
import SupabaseDB from "@/lib/supabase-client";

const Editor = dynamic(() => import("@/lib/editor"), { ssr: false });

const EditorPage: NextPage = () => {
  const router = useRouter();
  const { state, updateTrextContent } = useAppContext();

  // const { channel } = useChannel(
  //   `doc-${router.query.id}-change`,
  //   (message: Types.Message) => {
  //     console.log(message);
  //   },
  // );

  const fontSizes = [
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "25px",
    "30px",
    "35px",
    "40px",
    "45px",
    "50px",
    "60px",
    "70px",
    "80px",
    "90px",
  ];

  const [outputData, setOutputData] = useState<OutputData>();
  const [title, setTitle] = useState<string>("Some thing for this");
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [currId, setCurrId] = useState<string>(router.query.id as string);
  const [showBar, setShowBar] = useState<boolean>(true);
  const [instance, setInstance] = useState<EditorJS>();
  const [width] = useMediaQuery();
  const handleInstance = React.useCallback((instance: any) => {
    setInstance(instance);
  }, []);
  const [fontSize, setFontSize] = React.useState(fontSizes[0]);

  const onChange = (value: OutputData) => {
    console.log("from onChange", value);
    updateTrextContent(router.query.id as string, JSON.stringify(value));
    // channel.publish(String(value.time), value);
  };

  React.useEffect(() => {
    if (width !== 0) {
      if (width < 768) {
        setShowBar(false);
      } else {
        setShowBar(true);
      }
    }

    // const supabaseDB = new SupabaseDB();
    // channel.subscribe((message: Types.Message) => {
    //   if (message.data) {
    //     console.log("From subscribe and db", message.data);
    //     supabaseDB.stream(router.query.id as string, message.data);
    //     updateTrextContent(
    //       router.query.id as string,
    //       JSON.stringify(message.data),
    //     );
    //     setOutputData(message.data);
    //     instance?.render(message.data);
    //   }
    // });

    const handleRender = () => {
      const shared = JSON.parse((router.query.shared || "false") as string);
      if (state.trexts && !shared) {
        setTitle(state.trexts.filter((val) => val.id == currId)[0]?.title);
        setOutputData(
          JSON.parse(
            state.trexts.filter((val) => val.id == currId)[0]?.content || "{}",
          ),
        );
      } else if (state.sharedTrexts !== undefined && shared) {
        setTitle(
          state.sharedTrexts.filter((val) => val.id == currId)[0]?.title,
        );
        setOutputData(
          JSON.parse(
            state.sharedTrexts.filter((val) => val.id == currId)[0]?.content ||
              "{}",
          ),
        );
      }

      if (instance && !shared) {
        instance?.render(
          JSON.parse(
            state.trexts.filter((val) => val.id == currId)[0]?.content ||
              "{time: 0, blocks: [], version: 1}",
          ),
        );
      } else if (instance && shared) {
        instance?.render(
          JSON.parse(
            state.sharedTrexts.filter((val) => val.id == currId)[0]?.content ||
              "{time: 0, blocks: [], version: 1}",
          ),
        );
      }
    };

    router.events.on("routeChangeComplete", handleRender);

    return () => router.events.off("routeChangeComplete", handleRender);
  }, [instance, router]);

  const copy = () => {
    instance?.emit("copy", "");
  };

  const bold = () => {
    instance?.emit("bold", "");
  };

  const italic = () => {
    instance?.emit("italic", "");
  };

  const underline = () => {
    instance?.emit("underline", "");
  };

  const strikethrough = () => {
    instance?.emit("strikethrough", "");
  };

  const onSelectionChange = (index: number) => {
    setFontSize(fontSizes[index]);
  };

  const onTitleChange = (val: string) => {
    setTitle(val);
  };

  return (
    <div className="w-full h-full flex flex-row overflow-hidden">
      <EditorBar focusId={currId} showBar={showBar} changeFocus={setCurrId} />
      <Divider orientation="vertical" />
      <div className="h-full w-full flex flex-col items-center justify-start">
        <div className="h-12 w-full">
          <AppBar
            docId={router.query.id as string}
            onChange={onTitleChange}
            setShowBar={setShowBar}
            title={state.trexts ? title : ""}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
          />
        </div>
        <Divider orientation="horizontal" />
        <div className="w-full h-min flex flex-col gap-4 items-center">
          <div className="h-16 w-full flex flex-row px-4 gap-4 items-center">
            <ButtonGroup size="lg" isIconOnly variant="flat">
              <Button>
                <CiAlignLeft />
              </Button>
              <Button>
                <CiAlignRight />
              </Button>
              <Button>
                <CiAlignCenterH />
              </Button>
              <Button>
                <CiAlignBottom />
              </Button>
              <Button>
                <CiTextAlignJustify />
              </Button>
            </ButtonGroup>
            <ButtonGroup variant="bordered" size="lg" isIconOnly>
              <Button onClick={bold}>
                <LuBold />
              </Button>
              <Button onClick={italic}>
                <LuItalic />
              </Button>
              <Button onClick={underline}>
                <LuUnderline />
              </Button>
              <Button onClick={strikethrough}>
                <LuStrikethrough />
              </Button>
              <Button onClick={copy}>
                <BsFillClipboardFill />
              </Button>
            </ButtonGroup>
            <Button
              isIconOnly
              onClick={() => {
                onSelectionChange(
                  fontSize === fontSizes[0]
                    ? 0
                    : fontSizes.indexOf(fontSize) - 1,
                );
              }}
            >
              <AiOutlineMinus />
            </Button>
            <Select
              onChange={(e) => onSelectionChange(parseInt(e.target.value))}
              placeholder={fontSize}
              label="Font Size"
              className="w-[140px]"
            >
              {fontSizes.map((size, index) => (
                <SelectItem key={index} value={size}>
                  {size}
                </SelectItem>
              ))}
            </Select>
            <Button isIconOnly>
              <AiOutlinePlus />
            </Button>
          </div>
          <div className="h-[75%] lg:w-3/4 w-[80%] p-3 border-gray-300 border-1 rounded-md overflow-y-scroll">
            {outputData ? (
              <Editor
                id={currId}
                holder={String(router.query)}
                onChange={onChange}
                setInstance={handleInstance}
              />
            ) : undefined}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
