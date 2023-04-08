import React from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import classNames from "classnames";

export type Category = "podcast" | "audio";

interface CategorySelectorProps {
  onSelect(category: Category): void;
}
const toggleGroupItemClasses = "text-xl px-4 py-2 rounded-md";

export const CategorySelector = ({
  onSelect,
}: CategorySelectorProps) => {
  return (
    <ToggleGroup.Root
      className="flex-rol flex space-x-4 mb-4"
      type="single"
      onValueChange={onSelect}
      defaultValue="podcast"
    >
      <ToggleGroup.Item
        className={classNames(
          toggleGroupItemClasses,
          "bg-white/40 dark:bg-black/40 dark:text-white data-[state=on]:bg-green-400 dark:data-[state=on]:bg-green-400",
        )}
        value="podcast"
        aria-label="Podcast"
      >
        Podcast
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={classNames(
          toggleGroupItemClasses,
          "bg-white/40 dark:bg-black/40 dark:text-white data-[state=on]:bg-green-400 dark:data-[state=on]:bg-green-400",
        )}
        value="audio"
        aria-label="Audio"
      >
        Audio
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
