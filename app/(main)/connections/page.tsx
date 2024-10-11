import PageContainer from "@/components/page-container";
import { CONNECTIONS } from "@/lib/constants";
import ConnectionCard from "./_components/connection-card";
import {
  createGoogleConnection,
  createNotionConnection,
  getConnection,
} from "./_actions/connection";
import { ConnectionType } from "@/model/types";

interface IParams {
  error?: string;
  dataType?: string;
  accessToken?: string;
  botId?: string;
  workspaceId?: string;
  workspaceName?: string;
  code?: string;
}

const Connections = async ({ searchParams }: { searchParams: IParams }) => {
  const {
    error,
    dataType,
    accessToken,
    botId,
    workspaceId,
    workspaceName,
    code,
  } = searchParams;

  let errorMessage = error;
  let successMessage;

  const onUserConnection = async () => {
    if (dataType === ConnectionType.Notion && !error) {
      const response = await createNotionConnection({
        accessToken: accessToken!,
        botId: botId!,
        workspaceId: workspaceId!,
        workspaceName: workspaceName!,
      });
      if (response.error) {
        errorMessage = response.message;
      }
      successMessage = response.message;
    }
    if (dataType === ConnectionType.Gmail && !error) {
      const response = await createGoogleConnection(code!);
      if (response.error) {
        errorMessage = response.message;
      }
      successMessage = response.message;
    }
    return await getConnection();
  };

  const connection = await onUserConnection();

  return (
    <PageContainer
      title="Connections"
      errorMessage={errorMessage}
      successMessage={successMessage}
    >
      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col gap-4 p-6 text-muted-foreground">
          Connect all your apps directly from here. You may need to connect
          these apps regularly to refresh verification
          {CONNECTIONS.map((data, index) => (
            <ConnectionCard key={index} {...data} connection={connection} />
          ))}
        </section>
      </div>
    </PageContainer>
  );
};

export default Connections;
