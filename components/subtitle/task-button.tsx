import { use, useMemo, useState } from "react";
import { useInterval } from "ahooks";
import { LoadingCircle, LoadingSpinner } from "../shared/icons";

interface TaskButtonProps {
  task: "translate" | "summary" | "recos";
  taskId: string | undefined;
  handleTask: (task: string) => void;
}
const BASE_URL = "https://recos-audio-slice-production.up.railway.app";
const TaskButton = ({ task, taskId, handleTask }: TaskButtonProps) => {
  const [status, setStatus] = useState<"pending" | "success" | undefined>();
  const clear = useInterval(async () => {
    if (!taskId || taskId === "undefined") {
      return;
    }
    const data = await fetch(`${BASE_URL}/tasks/${taskId}`);
    const result = await data.json();
    const status = result["task_status"]?.toLowerCase();
    setStatus(result["task_status"]?.toLowerCase());
    if (status === "success") clear();
  }, 2000);

  return (
    <div
      className="flex cursor-pointer flex-row transition ease-in-out delay-150 items-center space-x-4 rounded-full border-none bg-green-400 px-6 py-2 font-semibold dark:bg-green-600"
      onClick={() => handleTask(task)}
    >
      <span>✨ {task.toUpperCase()}</span>
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
