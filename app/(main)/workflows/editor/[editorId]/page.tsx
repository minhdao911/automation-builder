import { getWorkflowConnectors, loadWorkflow } from "../../_actions/workflow";
import EditorCanvas from "./_components/editor-canvas";
import EditorNavbar from "./_components/editor-navbar";
import EditorContainer from "./_components/editor-container";

interface IParams {
  editorId: string;
}

interface ISearchParams {
  error?: string;
  dataType?: string;
}

const Editor = async ({
  params,
  searchParams,
}: {
  params: IParams;
  searchParams: ISearchParams;
}) => {
  const workflow = await loadWorkflow(params.editorId);
  const connectors = await getWorkflowConnectors();

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  if (!connectors) {
    return <div>Something went wrong</div>;
  }

  return (
    <EditorContainer
      errorMessage={
        searchParams.error
          ? `Fail to connect to ${searchParams.dataType}`
          : undefined
      }
    >
      <EditorNavbar workflow={workflow} />
      <EditorCanvas workflow={workflow} connectors={connectors} />
    </EditorContainer>
  );
};

export default Editor;
