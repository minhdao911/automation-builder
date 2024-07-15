import PageContainer from "@/components/page-container";
import { CONNECTIONS } from "@/lib/constants";
import ConnectionCard from "./_components/connection-card";
import { getConnection } from "./_actions/connection";

interface IParams {
  error?: string;
  dataType?: string;
}

const Connections = async ({ searchParams }: { searchParams: IParams }) => {
  const connection = await getConnection();

  if (!connection) return null;

  return (
    <PageContainer
      title="Connections"
      errorMessage={
        searchParams.error
          ? `Fail to connect to ${searchParams.dataType}`
          : undefined
      }
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
