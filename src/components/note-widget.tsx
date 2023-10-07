import * as React from "react";
import { Card } from "@nextui-org/react";
import Link from "next/link";

interface NoteWidgetProps {
  title: string;
  content: string;
  id: string;
}

const NoteWidget: React.FC<NoteWidgetProps> = ({ title, content, id }) => {
  return (
    <Link href={`/editor/${id}`} passHref>
      <Card
        className="w-[220px] h-full flex flex-col gap-2 bg-white/50 p-4 "
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-2xl font-bold">{title}</h1>
        <p>{content}</p>
      </Card>
    </Link>
  );
};

export default NoteWidget;
