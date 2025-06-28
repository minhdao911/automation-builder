import PageContainer from "@/components/page-container";
import { FunctionComponent, Suspense } from "react";
import { getWorkflows } from "./_actions/workflow";
import WorkflowCard from "./_components/workflow-card";
import WorkflowAddButton from "./_components/workflow-add-button";
import Loading from "@/app/loading";

interface WorkflowsPageProps {}

const WorkflowsPage: FunctionComponent<WorkflowsPageProps> = async () => {
  const workflows = await getWorkflows();

  return (
    <Suspense fallback={<Loading />}>
      <PageContainer title="Workflows" headerButton={<WorkflowAddButton />}>
        <div className="grid grid-flow-col gap-5 auto-cols-[minmax(0,_300px)] p-5">
          {workflows?.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </PageContainer>
    </Suspense>
  );
};

export default WorkflowsPage;
