import { SearchBoxProps } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchBox(props?: SearchBoxProps) {
  return (
    <div
      className={cn(
        "shadow-sm flex items-center gap-2 px-2 rounded-[12px]",
        props?.className
      )}
      style={{
        width: props?.width ?? "220px",
      }}
    >
      <Search size={20} className="text-muted-foreground" />
      <Input
        {...props}
        placeholder="Search"
        className="w-full border-none outline-none text-black  dark:bg-transparent bg-transparent ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:border-none focus-visible:ring-0"
      />
    </div>
  );
}
