import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import EDITOR_TOOLS, { NOTEPAD_TOOLS } from "./editor-tools";

//props
type Props = {
  setInstance?(val: EditorJS): void;
  onChange(val: OutputData): void;
  holder: string;
  isPad?: boolean;
  data?: OutputData;
  id: string;
};

const Editor = ({
  setInstance,
  onChange,
  holder,
  isPad = false,
  id,
  data,
}: Props) => {
  const ref = useRef<EditorJS>();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        placeholder: "Write something...",
        holder: holder,
        tools: !isPad ? EDITOR_TOOLS : NOTEPAD_TOOLS,
        data,
        onChange: async (api, event) => {
          const data = await api.saver.save();
          onChange(data);
        },
        hideToolbar: false,
        autofocus: !isPad,
        onReady: () => {
          const block = ref.current?.blocks!;
          setInstance && setInstance(ref.current!);

          ref.current?.on("copy", () => {
            navigator.clipboard.writeText(
              block.getBlockByIndex(block.getCurrentBlockIndex())?.holder
                .innerText || "",
            );
          });
          ref.current?.on("bold", () => {
            if (typeof window === "undefined") return;
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.holder?.setAttribute("style", "font-weight: bold");
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.dispatchChange();
          });
          ref.current?.on("italic", () => {
            if (typeof window === "undefined") return;
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.holder?.setAttribute("style", "font-style: italic");
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.dispatchChange();
          });

          ref.current?.on("underline", () => {
            if (typeof window === "undefined") return;
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.holder?.setAttribute("style", "text-decoration: underline");
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.dispatchChange();
          });

          ref.current?.on("strikethrough", () => {
            if (typeof window === "undefined") return;
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.holder?.setAttribute("style", "text-decoration: line-through");
            block
              .getBlockByIndex(block.getCurrentBlockIndex())
              ?.dispatchChange();
          });
        },
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    // return () => {
    //   if (ref.current && ref.current.destroy) {
    //     ref.current.destroy();
    //   }
    // };
  }, [id]);

  return <div id={holder} />;
};

export default memo(Editor);
