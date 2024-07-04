import CustomSheet, { CustomSheetTitle } from "@/components/ui/custom-sheet";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/stores/editor-store";
import { useNodeModalStore } from "@/stores/node-modal-store";
import { FunctionComponent } from "react";

interface EditorCanvasNodeSettingsProps {}

const EditorCanvasNodeSettings: FunctionComponent<
  EditorCanvasNodeSettingsProps
> = () => {
  const { open, setOpen } = useNodeModalStore();
  const { selectedNode } = useEditorStore();

  if (!selectedNode) return null;

  return (
    <CustomSheet
      className="top-[80px] p-6"
      open={open}
      onClose={() => setOpen(false)}
    >
      <CustomSheetTitle>{selectedNode.data.title}</CustomSheetTitle>
    </CustomSheet>
  );
};

export default EditorCanvasNodeSettings;
