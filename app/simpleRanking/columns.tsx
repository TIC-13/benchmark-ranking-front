"use client"

import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "../src/utils/formatNumber"
import { useDictionary } from "@/components/providers/DictionaryProvider"

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
    cpu?: number,
    gpu?: number,
    ram?: number,
    showSamples: boolean,
    showPowerAndEnergy: boolean
}

export type Phone = {
    id: number,
    brand_name: string,
    phone_model: string
}

export type DisplayModeVision = "speed" | "cpu" | "gpu" | "ram"

const displayModes: Record<DisplayModeVision, {
    getValue: (result: Result) => number | undefined, 
    getDisplayValue: (result: Result) => string
}> = {
    speed: { 
        getValue: ({speed}) => speed,
        getDisplayValue: ({speed}) => speed? `${speed} ms` : "-"
    },
    cpu: {
        getValue: ({cpu}) => cpu,
        getDisplayValue: ({cpu}) => cpu? `${cpu}%`: "-"
    },
    gpu: {
        getValue: ({gpu}) => gpu,
        getDisplayValue: ({gpu}) => gpu? `${gpu}%`: "-"
    },
    ram: {
        getValue: ({ram}) => ram,
        getDisplayValue: ({ram}) => ram? `${ram} MB`: "-"
    }
}

const getSortingFn = (mode: DisplayModeVision = "speed") => (rowA: Row<Inference>, rowB: Row<Inference>, columnId: string) => {

    const sortStatus = rowA.getAllCells()
        .find(cell => cell.column.id === columnId)
        ?.column
        .getIsSorted() ?? false

    const maxValue = -99999999 * (sortStatus === "asc" ? -1 : 1)
    const maxIfDoesNotExist = (number: number | undefined) => number !== undefined && number !== null && number !== 0? number : maxValue

    const getRowValue = (row: Row<Inference>) => {
        const value = row.getValue<Result | null>(columnId)
        const config = displayModes[mode]
        return maxIfDoesNotExist(value !== null && value !== undefined? config.getValue(value): undefined)
    }

    const [rowAValue, rowBValue] = [getRowValue(rowA), getRowValue(rowB)]

    console.log(rowAValue, rowBValue)

    if (rowAValue === rowBValue) return 0;
    return rowAValue < rowBValue ? -1 : 1;
}

export const getColumns = (mode: DisplayModeVision = "speed"): ColumnDef<Inference>[] => 
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

function getColumnDef(rowName: string, mode: DisplayModeVision = "speed"): ColumnDef<Inference> {
    return {
        accessorKey: rowName,
        header: getHeader(rowName),
        cell: getRowValue(rowName, mode),
        sortingFn: getSortingFn(mode),
        enableSorting: true,
    }
}

function getRowValue(pickedRow: string, mode: DisplayModeVision) {
    return ({ row }: { row: Row<Inference> }) => {

        const { dictionary } = useDictionary()
        const {visionRanking: dict} = dictionary

        const value = row.getValue(pickedRow) as Result | null
        const { showSamples } = value ?? { showSamples: true, showPowerAndEnergy: true }
        const displayValue = value? displayModes[mode].getDisplayValue(value): "-"

        const numSamples =
            !showSamples ?
                null :
                value?.samples ?
                    `${formatNumber(value.samples)} ${value.samples === 1 ? dict.table.inference.singular : dict.table.inference.plural}` :
                    dict.table.unavailable.inferencesNumber

        return (
            <div className="flex flex-1 justify-center">
                <Button
                    variant="ghost"
                    className="italic min-w-52"
                >
                    {
                        value !== null ?

                            <div className="flex flex-col gap-y-1 w-100">
                                <p className={`text-${numSamples !== null ? "base" : "base"}`}>{displayValue}</p>
                                {
                                    numSamples &&
                                    <p className="text-xs">{numSamples}</p>
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

        const dict = useDictionary()

        const sortStatus = column.getIsSorted()
        const isSelected = sortStatus !== false
        const iconClass = "ml-2 h-4 w-4"

        return (
            <div className="flex flex-1 justify-center">
                <Button
                    variant={isSelected ? "default" : "ghost"}
                    onClick={() => column.toggleSorting(sortStatus === "asc")}
                >
                    {`${dict.dictionary.actions.runningOn} ${label}`}
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