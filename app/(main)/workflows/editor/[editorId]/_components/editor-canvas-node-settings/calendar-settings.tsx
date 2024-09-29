import { FunctionComponent, useState, useTransition } from "react";
import { SettingsSectionWithEdit } from "./common";
import { Label } from "@/components/ui/label";
import { WorkflowNodeData } from "@/model/types";
import { Node } from "reactflow";
import DatePicker from "@/components/ui/date-picker";
import TimePickerInput from "@/components/ui/time-picker-input";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CalendarEvent, CalendarEventForm } from "@/model/google-schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/stores/editor-store";
import Loader from "@/components/ui/loader";
import { createCalendarEvent } from "@/lib/google-helpers";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [allDay, setAllDay] = useState(false);

  const savedData = calendarData
    ? [
        { name: "Title", value: calendarData.summary },
        { name: "Start date", value: calendarData.start.dateTime },
        { name: "End date", value: calendarData.end.dateTime },
        { name: "Description", value: calendarData.description },
      ]
    : undefined;

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
    const finalStartTime = allDay ? "00:00" : startTime;
    const finalEndTime = allDay ? "23:59" : endTime;
    const startDate = dayjs(date)
      .set("hour", parseInt(finalStartTime.split(":")[0]))
      .set("minute", parseInt(finalStartTime.split(":")[1]))
      .format();
    const endDate = dayjs(date)
      .set("hour", parseInt(finalEndTime.split(":")[0]))
      .set("minute", parseInt(finalEndTime.split(":")[1]))
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
      <SettingsSectionWithEdit
        title="Event Details"
        actionButton={
          <Button size="sm" variant="secondary" onClick={onCreateTestEvent}>
            {isPending ? <Loader /> : <>Create test event</>}
          </Button>
        }
        savedData={savedData}
        edit={edit}
        setEdit={setEdit}
        onSaveClick={handleSubmit(onSubmit)}
      >
        <form
          className="flex flex-col gap-4"
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p>from</p>
                <TimePickerInput
                  className={`${errors.startTime ? "border-red-500" : ""}`}
                  disabled={allDay}
                  {...register("startTime", { required: true })}
                />
                <p>to</p>
                <TimePickerInput
                  className={`${errors.endTime ? "border-red-500" : ""}`}
                  disabled={allDay}
                  {...register("endTime", { required: true })}
                />
              </div>
              <div className="border-r h-8 border-input" />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="allDay"
                  checked={allDay}
                  onCheckedChange={(checked: boolean) => setAllDay(checked)}
                />
                <label htmlFor="allDay">All day</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
        </form>
      </SettingsSectionWithEdit>
    </>
  );
};

export default CalendarSettings;
