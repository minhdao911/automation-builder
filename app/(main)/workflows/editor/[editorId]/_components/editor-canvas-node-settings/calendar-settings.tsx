import { FunctionComponent, useState, useTransition } from "react";
import { SettingsSection } from "./common";
import { Label } from "@/components/ui/label";
import { WorkflowNodeData } from "@/lib/types";
import { Node } from "reactflow";
import DatePicker from "@/components/ui/date-picker";
import TimePickerInput from "@/components/ui/time-picker-input";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CalendarEvent, CalendarEventForm } from "@/lib/google-schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/stores/editor-store";
import Loader from "@/components/ui/loader";
import { createCalendarEvent } from "@/lib/google-helpers";
import { toast } from "@/components/ui/use-toast";

interface CalendarSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const CalendarSettings: FunctionComponent<CalendarSettingsProps> = ({
  selectedNode,
}) => {
  const timeFormat = "HH:mm";
  const { metadata } = selectedNode.data;
  const calendarData = metadata?.googleCalendar;
  const currentDate = calendarData
    ? new Date(calendarData.start.dateTime)
    : new Date();

  const [date, setDate] = useState(currentDate);
  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const showEdit = edit || !calendarData;

  const { updateNode } = useEditorStore();
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalendarEventForm>({
    defaultValues: {
      startTime: dayjs(currentDate).format(timeFormat),
      endTime: dayjs(currentDate).format(timeFormat),
      summary: calendarData?.summary ?? "",
      description: calendarData?.description ?? "",
    },
  });

  const getCalendarEvent = (data: CalendarEventForm): CalendarEvent => {
    const { startTime, endTime, summary, description } = data;
    const startDate = dayjs(date)
      .set("hour", parseInt(startTime.split(":")[0]))
      .set("minute", parseInt(startTime.split(":")[1]))
      .format();
    const endDate = dayjs(date)
      .set("hour", parseInt(endTime.split(":")[0]))
      .set("minute", parseInt(endTime.split(":")[1]))
      .format();
    return {
      start: {
        dateTime: startDate,
      },
      end: {
        dateTime: endDate,
      },
      summary,
      description,
    };
  };

  const onSubmit = (data: CalendarEventForm) => {
    const event = getCalendarEvent(data);
    const metadata = selectedNode.data.metadata;
    const updatedMetadata = {
      ...metadata,
      googleCalendar: event,
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  const onCreateTestEvent = () => {
    startTransition(async () => {
      const startTime = getValues("startTime");
      const endTime = getValues("endTime");
      const summary = getValues("summary");
      const description = getValues("description");
      const event = getCalendarEvent({
        startTime,
        endTime,
        summary,
        description,
      });
      const success = await createCalendarEvent(event);
      if (success) {
        toast({
          description: "Test event created successfully",
        });
      } else {
        toast({
          description: "Failed to create test event",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <SettingsSection title="Event Details">
        {showEdit ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="summary">Title</Label>
              <Input
                id="summary"
                className={`${errors.summary ? "border-red-500" : ""}`}
                {...register("summary", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <div className="flex items-center gap-2">
                <DatePicker
                  className={`${!date ? "border-red-500" : ""}`}
                  value={date}
                  onChange={setDate}
                />
                <p>from</p>
                <TimePickerInput
                  className={`${errors.startTime ? "border-red-500" : ""}`}
                  {...register("startTime", { required: true })}
                />
                <p>to</p>
                <TimePickerInput
                  className={`${errors.endTime ? "border-red-500" : ""}`}
                  {...register("endTime", { required: true })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
            </div>
            <div className="flex gap-3 justify-end mt-2">
              <Button size="sm" variant="secondary" onClick={onCreateTestEvent}>
                {isPending ? <Loader /> : <>Create test event</>}
              </Button>
              <Button type="submit" size="sm" onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Title</p>
              <p className="">{calendarData.summary}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Start date</p>
              <p className="">{calendarData.start.dateTime}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">End date</p>
              <p className="">{calendarData.end.dateTime}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Description</p>
              <p
                className={`${
                  calendarData.description ? "" : "italic text-neutral-400"
                }`}
              >
                {calendarData.description || "No description"}
              </p>
            </div>
            <div className="flex gap-3 justify-end mt-10">
              <Button size="sm" variant="secondary" onClick={onCreateTestEvent}>
                {isPending ? <Loader /> : <>Create test event</>}
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

export default CalendarSettings;
