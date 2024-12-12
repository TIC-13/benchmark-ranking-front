import { Table } from "@tanstack/react-table";
import { table } from "console";
import { Button } from "../ui/button";
import { useDictionary } from "../providers/DictionaryProvider";

type PaginationControlsProps<T> = {
    table: Table<T>
}

export default function PaginationControls<T>({table}: PaginationControlsProps<T>) {

    const dict = useDictionary()
    const { previous, next } = dict.dictionary.tableControls

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {next}
        </Button>
      </div>
    )
}