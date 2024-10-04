import { useEditorStore } from "@/stores/editor-store";
import { useEffect } from "react";
import { BaseEdge, getBezierPath } from "reactflow";

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  selected?: boolean;
}

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}: CustomEdgeProps) => {
  const { removeEdge } = useEditorStore();
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  useEffect(() => {
    if (selected) {
      removeEdge(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return <BaseEdge id={id} path={edgePath} />;
};

export default CustomEdge;
