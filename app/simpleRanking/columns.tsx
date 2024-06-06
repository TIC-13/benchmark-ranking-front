"use client"

import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CloudLightning } from "lucide-react"

export type Inference = {
    phone: Phone,
    CPU: Result | null,
    GPU: Result | null,
    NNAPI: Result | null
}

type Result = {
    speed?: number,
    samples?: number,
    power?: number,
    energy?: number,
    showSamples: boolean,
    showPowerAndEnergy: boolean
}

export type Phone = {
    id: number,
    brand_name: string,
    phone_model: string
}

const sortingFn = (rowA: Row<Inference>, rowB: Row<Inference>, columnId: string) => {
    const minSpeed = -99999

    const getRowValue = (row: Row<Inference>) => {
        const value = row.getValue<Result | null>(columnId)
        return value ? value.speed ?? minSpeed : minSpeed
    }

    const [rowAValue, rowBValue] = [getRowValue(rowA), getRowValue(rowB)]

    if (rowAValue === rowBValue) return 0;
    return rowAValue < rowBValue ? 1 : -1;
}

export const columns: ColumnDef<Inference>[] = [
    {
        accessorKey: "phone",
        header: "Smartphone",

        cell: ({ row }: { row: Row<Inference> }) =>
            (row.getValue("phone") as Phone).phone_model,

        enableSorting: true
    },
    getColumnDef("CPU"),
    getColumnDef("GPU"),
    getColumnDef("NNAPI")
]

function getColumnDef(rowName: string): ColumnDef<Inference> {
    return {
        accessorKey: rowName,
        header: getHeader(rowName),
        cell: getRowValue(rowName),
        sortingFn: sortingFn,
        enableSorting: true,
    }
}

function getRowValue(pickedRow: string) {
    return ({ row }: { row: Row<Inference> }) => {

        const value = row.getValue(pickedRow) as Result | null
        const { showSamples, showPowerAndEnergy } = value ?? { showSamples: true, showPowerAndEnergy: true }
        const speed = value?.speed ? `${value.speed} ms` : "-"

        const numSamples =
            !showSamples ?
                null :
                value?.samples ?
                    `${value.samples} inferência${value.samples === 1 ? "" : "s"}` :
                    "Inferências não calculadas"

        const power =
            !showPowerAndEnergy ?
                null :
                (value?.power && value.energy) ?
                    `⚡${value.power.toFixed(2)}W e ${value.energy?.toFixed(2)}J` :
                    "Energia não calculada"

        return (
            <div className="flex flex-1 justify-center">
                <Button
                    variant="ghost"
                    className="italic w-25"
                >
                    {
                        value !== null ?

                            <div className="flex flex-col gap-y-1 w-100">
                                <p className={`text-${numSamples !== null ? "base" : "base"}`}>{speed}</p>
                                {
                                    numSamples &&
                                    <p className="text-xs">{numSamples}</p>
                                }
                                {
                                    power &&
                                   <p className="text-xs">{power}</p>
                                }
                            </div>
                            : "-"
                    }
                </Button>
            </div>

        )
    }
}

function getHeader(label: string) {
    return ({ column }: { column: Column<Inference> }) => {

        const sortStatus = column.getIsSorted()
        const isSelected = sortStatus !== false
        const iconClass = "ml-2 h-4 w-4"

        return (
            <div className="flex flex-1 justify-center">
                <Button
                    variant={isSelected ? "default" : "ghost"}
                    //className={`bg-${colors.background} text-${colors.foreground}`}
                    onClick={() => column.toggleSorting(sortStatus === "asc")}
                >
                    {label}
                    {
                        sortStatus !== false ?
                            sortStatus === "asc" ?
                                <ArrowDown className={iconClass} /> :
                                <ArrowUp className={iconClass} /> :
                            <ArrowUpDown className={iconClass} />
                    }
                </Button>
            </div>

        )
    }
}