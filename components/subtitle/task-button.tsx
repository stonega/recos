import { useState } from "react";
import { useInterval } from "ahooks";
import { LoadingCircle } from "../shared/icons";
import { useSWRConfig } from "swr";

interface TaskButtonProps {
  task: "translate" | "summary" | "recos";
  taskId: string | undefined;
  handleTask: (task: string) => void;
}
const BASE_URL = "https://recos-audio-slice-production.up.railway.app";
const TaskButton = ({ task, taskId, handleTask }: TaskButtonProps) => {
  const [status, setStatus] = useState<"pending" | "success" | undefined>();
  const { mutate } = useSWRConfig();
  const clear = useInterval(async () => {
    if (!taskId || taskId === "undefined") {
      return;
    }
    if (taskId === "pending") {
      setStatus("pending");
      return;
    }
    const data = await fetch(`${BASE_URL}/tasks/${taskId}`);
    const result = await data.json();
    const status = result["task_status"]?.toLowerCase();
    setStatus(result["task_status"]?.toLowerCase());
    mutate(`/api/subtitle/${encodeURIComponent(taskId)}`);
    if (status === "success") clear();
  }, 2000);

  return (
    <div
      className="flex cursor-pointer flex-row items-center space-x-4 rounded-full border-none bg-green-400 px-6 py-2 font-semibold transition delay-150 ease-in-out dark:bg-green-800"
      onClick={() => handleTask(task)}
    >
      ✨ <span className="ml-2 leading-none">{task.toUpperCase()}</span>
      {status === "pending" ? (
        <LoadingCircle />
      ) : status === "success" ? (
        <span> ✅ </span>
      ) : (
        ""
      )}
    </div>
  );
};

export default TaskButton;
