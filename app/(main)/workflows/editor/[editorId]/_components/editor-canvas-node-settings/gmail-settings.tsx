import { WorkflowNodeData } from "@/model/types";
import { Node } from "reactflow";
import { SettingsSection } from "./common";
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/lib/google-helpers";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Email } from "@/model/google-schemas";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useEditorStore } from "@/stores/editor-store";
import { useState, useTransition } from "react";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";

interface GmailSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const GmailSettings = ({ selectedNode }: GmailSettingsProps) => {
  const { user } = useUser();
  const { updateNode } = useEditorStore();

  const { metadata } = selectedNode.data;
  const gmailData = metadata?.gmail;
  const userEmail = user!.emailAddresses[0].emailAddress;

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Email>({
    defaultValues: {
      to: gmailData?.to ?? "",
      subject: gmailData?.subject ?? "",
      html: gmailData?.html ?? "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [edit, setEdit] = useState(false);

  const showEdit = edit || !gmailData;

  const onSubmit = (data: Email) => {
    const { to, subject, html } = data;
    const metadata = selectedNode.data.metadata;
    const updatedMetadata = {
      ...metadata,
      gmail: {
        to,
        subject,
        html,
      },
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  const onSendTestEmail = () => {
    startTransition(async () => {
      const to = getValues("to");
      const subject = getValues("subject");
      const html = getValues("html");
      const success = await sendEmail({
        to,
        subject,
        html,
      });
      if (success) {
        toast({
          description: "Email sent successfully",
        });
      } else {
        toast({
          description: "Failed to send email",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <SettingsSection title="Email">
        {showEdit ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="from" className="w-12">
                  From:
                </Label>
                <Input
                  id="from"
                  className={`col-span-3`}
                  defaultValue={userEmail}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="to" className="w-12">
                  To:
                </Label>
                <Input
                  id="to"
                  placeholder="Recipient email address"
                  className={`col-span-3 ${errors.to ? "border-red-500" : ""}`}
                  {...register("to", { required: true })}
                  aria-invalid={errors.to ? "true" : "false"}
                />
              </div>
              <Input
                id="subject"
                placeholder="Subject"
                className={`${errors.subject ? "border-red-500" : ""}`}
                {...register("subject", { required: true })}
                aria-invalid={errors.subject ? "true" : "false"}
              />
              <Textarea
                placeholder="Type your message here"
                className={`${errors.html ? "border-red-500" : ""}`}
                {...register("html", { required: true })}
                aria-invalid={errors.html ? "true" : "false"}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button size="sm" variant="secondary" onClick={onSendTestEmail}>
                {isPending ? <Loader /> : <>Send test email</>}
              </Button>
              <Button size="sm" type="submit" onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center">
              <p className="font-semibold w-14">From:</p>
              <p className="text-sm">{userEmail}</p>
            </div>
            <div className="flex items-center mt-1 mb-3">
              <p className="font-semibold w-14">To:</p>
              <p className="text-sm">{gmailData?.to}</p>
            </div>
            <Separator />
            <p className="my-3 font-semibold">{gmailData?.subject}</p>
            <Separator />
            <p className="mt-3">{gmailData?.html}</p>
            <div className="flex gap-3 justify-end mt-10">
              <Button size="sm" variant="secondary" onClick={onSendTestEmail}>
                {isPending ? <Loader /> : <>Send test email</>}
              </Button>
              <Button size="sm" onClick={() => setEdit(true)}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>
    </>
  );
};

export default GmailSettings;
