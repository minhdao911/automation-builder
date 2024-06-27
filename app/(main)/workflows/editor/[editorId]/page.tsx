import { getWorkflow } from "../../_actions/workflow";
import EditorCanvas from "./_components/editor-canvas";
import EditorNavbar from "./_components/editor-navbar";

interface IParams {
  editorId: string;
}

const Editor = async ({ params }: { params: IParams }) => {
  const workflow = await getWorkflow(params.editorId);

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <div className="w-full h-full">
      <EditorNavbar workflow={workflow} />
      <EditorCanvas workflow={workflow} />
    </div>
  );
};

export default Editor;
