//index.tsx
import EditorJS, { OutputData } from "@editorjs/editorjs";
import * as React from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import EditorBar from "@/components/editor-bar";
import { Divider } from "@nextui-org/react";
import AppBar from "@/components/Appbar";
import useMediaQuery from "@/lib/useMediaQuery";
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

const Editor = dynamic(() => import("@/lib/editor"), { ssr: false });

const EditorPage: NextPage = () => {
  const { query } = useRouter();

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

  const [outputData, setOutputData] = useState<OutputData>({
    blocks: [
      {
        type: "paragraph",
        data: {
          text: query.id,
        },
      },
    ],
  });
  const [title, setTitle] = useState<string>("Some thing for this");
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [showBar, setShowBar] = useState<boolean>(true);
  const [instance, setInstance] = useState<EditorJS>();
  const [width, height] = useMediaQuery();
  const handleInstance = React.useCallback((instance: any) => {
    setInstance(instance);
  }, []);
  const [fontSize, setFontSize] = React.useState(fontSizes[0]);

  const onChange = (val: OutputData) => {
    setOutputData(val);
  };

  React.useEffect(() => {
    if (width !== 0) {
      console.log(width);
      if (width < 768) {
        setShowBar(false);
      } else {
        setShowBar(true);
      }
    }
  }, [width]);

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

  return (
    <div className="w-full h-full flex flex-row gap-0">
      <EditorBar showBar={showBar} editor={instance!} />
      <Divider orientation="vertical" />
      <div className="h-full w-full flex flex-col items-center">
        <AppBar
          setShowBar={setShowBar}
          title={title}
          setTitle={setTitle}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
        />
        <Divider orientation="horizontal" />
        <div className="w-full h-full flex flex-col gap-4 items-center">
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
          <div className="h-auto lg:w-2/4 w-[80%] p-6 border-gray-300 border-1 rounded-md mt-4 flex flex-col gap-4">
            <Editor
              holder="editor"
              onChange={onChange}
              data={outputData}
              setInstance={handleInstance}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
