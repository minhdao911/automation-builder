import {
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEditorStore } from "@/stores/editor-store";
import { FunctionComponent } from "react";

interface EditorCanvasNodeSettingsProps {
  title: string;
  setOpenModal: (open: boolean) => void;
}

const EditorCanvasNodeSettings: FunctionComponent<
  EditorCanvasNodeSettingsProps
> = ({ title, setOpenModal }) => {
  const { deselectNodes } = useEditorStore();

  return (
    <SheetContent className={`top-[80px]`}>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      <SheetClose
        onClick={() => {
          deselectNodes();
          setOpenModal(false);
        }}
      />
    </SheetContent>
  );
};

export default EditorCanvasNodeSettings;
