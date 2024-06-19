import PageContainer from "@/components/page-container";
import { FunctionComponent } from "react";
import WorkflowDialog from "./_components/workflow-dialog";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getWorkflows } from "./_actions/workflow-connections";
import WorkflowCard from "./_components/workflow-card";

interface WorkflowsPageProps {}

const WorkflowsPage: FunctionComponent<WorkflowsPageProps> = async () => {
  const workflows = await getWorkflows();

  return (
    <PageContainer title="Workflows" headerButton={<WorkflowDialog />}>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-5">
        {workflows?.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            id={workflow.id}
            name={workflow.name}
            description={workflow.description}
            published={workflow.published}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default WorkflowsPage;
