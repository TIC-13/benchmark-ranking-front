"use client"

import React, { useState } from "react"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LoadingSpinner } from "@/components/custom/LoadingSpinner"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([
    { id: "result", desc: true }
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="bg-secondary text-secondary-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell, idx) => idx == 0 || !isLoading ? (
                  <TableCell key={cell.id} colSpan={1}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ) :
                  <TableCell key={cell.id} colSpan={1}>
                    <div className="flex flex-1 justify-center">
                      <Button
                        variant="ghost"
                        className="italic min-w-52 align-center-justify-center"
                      >
                        <LoadingSpinner />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}