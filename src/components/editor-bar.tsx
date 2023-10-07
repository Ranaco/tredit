import * as React from "react";
import EditorJS from "@editorjs/editorjs";

interface EditorBarProps {
  showBar: boolean;
  editor: EditorJS;
}

const EditorBar: React.FC<EditorBarProps> = ({ showBar, editor }) => {
  return (
    <div
      className={`${
        showBar ? "w-[20%] min-w-[300px]" : "w-0 min-w-0"
      } flex-col pt-4 flex items-center p-4 transition-width duration-300`}
    >
      Sidebar
    </div>
  );
};

export default EditorBar;
