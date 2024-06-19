"use client"

import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "../src/utils/formatNumber"

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

type SortingMode = "speed" | "energy"

const getSortingFn = (mode: SortingMode = "speed") => (rowA: Row<Inference>, rowB: Row<Inference>, columnId: string) => {
    const maxValue = 99999999

    const getRowValue = (row: Row<Inference>) => {
        const value = row.getValue<Result | null>(columnId)
        if(mode === "speed")
            return value ? value.speed ?? maxValue : maxValue
        return value ? value.energy ?? maxValue: maxValue
    }

    const [rowAValue, rowBValue] = [getRowValue(rowA), getRowValue(rowB)]

    if (rowAValue === rowBValue) return 0;
    return rowAValue < rowBValue ? 1 : -1;
}

export const getColumns = (mode: SortingMode = "speed"): ColumnDef<Inference>[] => 
    [
        {
            accessorKey: "phone",
            header: "Smartphone",
    
            cell: ({ row }: { row: Row<Inference> }) =>
                (row.getValue("phone") as Phone).phone_model,
    
            enableSorting: true
        },
        getColumnDef("CPU", mode),
        getColumnDef("GPU", mode),
        getColumnDef("NNAPI", mode)
    ]

function getColumnDef(rowName: string, mode: SortingMode = "speed"): ColumnDef<Inference> {
    return {
        accessorKey: rowName,
        header: getHeader(rowName),
        cell: getRowValue(rowName),
        sortingFn: getSortingFn(mode),
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
                    `${formatNumber(value.samples)} inferência${value.samples === 1 ? "" : "s"}` :
                    "Inferências não calculadas"

        const power =
            !showPowerAndEnergy ?
                null :
                (value?.power && value.energy) ?
                    `⚡${value.power.toFixed(2)}W | ${value.energy?.toFixed(2)}J` :
                    "Consumo não calculado"

        return (
            <div className="flex flex-1 justify-center">
                <Button
                    variant="ghost"
                    className="italic min-w-52"
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