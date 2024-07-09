import { CustomSheetSectionTitle } from "@/components/ui/custom-sheet";

export const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <section className="p-4 bg-background border rounded-lg">
      <CustomSheetSectionTitle className="mb-3">
        {title}
      </CustomSheetSectionTitle>
      {children}
    </section>
  );
};
