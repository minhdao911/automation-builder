import { getWorkflow, getWorkflowConnectors } from "../../_actions/workflow";
import EditorCanvas from "./_components/editor-canvas";
import EditorNavbar from "./_components/editor-navbar";

interface IParams {
  editorId: string;
}

const Editor = async ({ params }: { params: IParams }) => {
  const workflow = await getWorkflow(params.editorId);
  const connectors = await getWorkflowConnectors();

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  if (!connectors) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="w-full h-full">
      <EditorNavbar workflow={workflow} />
      <EditorCanvas workflow={workflow} connectors={connectors} />
    </div>
  );
};

export default Editor;
