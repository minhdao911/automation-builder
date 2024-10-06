import PageContainer from "@/components/page-container";
import { FunctionComponent } from "react";
import WorkflowDialog from "./_components/workflow-dialog";
import { getWorkflows } from "./_actions/workflow";
import WorkflowCard from "./_components/workflow-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WorkflowsPageProps {}

const WorkflowsPage: FunctionComponent<WorkflowsPageProps> = async () => {
  const workflows = await getWorkflows();

  return (
    <PageContainer
      title="Workflows"
      headerButton={
        <WorkflowDialog
          trigger={
            <Button
              size="sm"
              className="h-8 w-8 p-1.5 bg-[#7540A9] hover:bg-[#8057a9] dark:bg-primary"
            >
              <Plus size={24} />
            </Button>
          }
        />
      }
    >
      {/* <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-5"> */}
      <div className="grid grid-flow-col gap-5 auto-cols-[minmax(0,_300px)] p-5">
        {workflows?.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </PageContainer>
  );
};

export default WorkflowsPage;
