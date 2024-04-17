"use client"

import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Inference = {
    phone: Phone,
    CPU: number | null,
    GPU: number | null,
    NNAPI: number | null
}

export type Phone = {
    id: number,
    brand_name: string,
    phone_model: string
}

export const columns: ColumnDef<Inference>[] = [
    {
        accessorKey: "phone",
        header: "Smartphone",
        cell: ({ row }: { row: Row<Inference> }) =>
            (row.getValue("phone") as Phone).phone_model
    },
    getColumnDef("CPU"),
    getColumnDef("GPU"),
    getColumnDef("NNAPI")
]

function getColumnDef(rowName: string): ColumnDef<Inference> {
    return {
        accessorKey: rowName,
        header: getHeader(rowName),
        cell: getRowValue(rowName)
    }
}

function getRowValue(pickedRow: string) {
    return ({ row }: { row: Row<Inference> }) => {
        const value = row.getValue(pickedRow)
        return (
            <Button
                variant="ghost"
            >
                {value ? value + " ms" : "-"}
            </Button>
        )
    }
}

function getHeader(label: string) {
    return ({ column }: { column: Column<Inference> }) => {

        const sortStatus = column.getIsSorted()
        const iconClass = "ml-2 h-4 w-4"

        const colors =
            sortStatus !== false ?
                {
                    background: "primary",
                    foreground: "primary-foreground"
                } :
                {
                    background: "undefined",
                    foreground: "undefined"
                }

        return (
            <Button
                variant={sortStatus !== false ? "default" : "ghost"}
                className={`bg-${colors.background} text-${colors.foreground}`}
                onClick={() => column.toggleSorting(sortStatus === "asc")}
            >
                {label}
                {
                    sortStatus !== false ?
                        sortStatus === "desc" ?
                            <ArrowDown className={iconClass} /> :
                            <ArrowUp className={iconClass} /> :
                        <ArrowUpDown className={iconClass} />
                }
            </Button>
        )
    }
}