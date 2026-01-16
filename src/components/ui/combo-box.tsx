"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { FixedSizeList as List } from "react-window";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ITEM_HEIGHT = 36;
const LIST_HEIGHT = 400;

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  onSearch,
}: {
  options: { value: string; label: string; searchText?: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      (option.searchText || option.label)
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const option = filteredOptions[index];
    return (
      <CommandItem
        key={option.value}
        value={option.searchText || option.label}
        onSelect={(currentValue) => {
          onChange(currentValue === value ? "" : option.value);
          setOpen(false);
          setSearchValue("");
        }}
        style={style}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            value === option.value ? "opacity-100" : "opacity-0"
          )}
        />
        {option.label}
      </CommandItem>
    );
  };

  return (
    <>
      <Button
        variant="outline"
        type="button"
        role="combobox"
        aria-expanded={open}
        className="w-full rounded-2xl justify-between"
        onClick={() => setOpen(true)}
      >
        {value ? options.find((option) => option.value === value)?.label : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {placeholder}
            </DialogTitle>
          </DialogHeader>
          <Command className="rounded-lg border shadow-none border-none bg-transparent">
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={handleSearch}
              className="h-9"
            />
            <CommandList>
              {filteredOptions.length === 0 ? (
                <CommandEmpty>No options found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  <List
                    height={Math.min(filteredOptions.length * ITEM_HEIGHT, LIST_HEIGHT)}
                    itemCount={filteredOptions.length}
                    itemSize={ITEM_HEIGHT}
                    width="100%"
                  >
                    {Row}
                  </List>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
