import { CategoryBar } from "@tremor/react";

export interface ItemCategoryBarProps {
  completed: number;
  inProgress: number;
  remaining: number;
  total: number;
}

export default function ItemCategoryBar({
  completed,
  inProgress,
  remaining,
  total
}: ItemCategoryBarProps) {
  return <CategoryBar
      values={[completed/total*100, inProgress/total*100, remaining/total*100]}
      colors={["emerald", "yellow"]}
      showLabels={false}
      className="mt-3"
    />
  }