"use client"

import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "../src/utils/formatNumber"
import { useDictionary } from "@/components/providers/DictionaryProvider"

export type Inference = {
    phone: Phone,
    result: LLMResult
}

type LLMResult = {
    prefill?: number,
    decode?: number,
    power?: number,
    energy?: number,
    samples?: number,
    showSamples: boolean,
    showPowerAndEnergy: boolean,
}

export type Phone = {
    id: number,
    brand_name: string,
    phone_model: string
}

export type DisplayMode = "prefill" | "decode" | "total"

export function isDisplayMode(mode: string): mode is DisplayMode {
    return mode === "prefill" || mode === "decode" || mode === "total";
}

type SortingMode = DisplayMode| "energy"

const getSortingFn = (mode: SortingMode) => (rowA: Row<Inference>, rowB: Row<Inference>, columnId: string) => {
    const maxValue = -99999999
    const maxIfDoesNotExist = (number: number | undefined) => number !== undefined ? number: maxValue 

    const getRowValue = (row: Row<Inference>) => {

        const value = row.getValue<LLMResult | null>(columnId)
        const prefill = value?.prefill
        const decode = value?.decode
        const total = (prefill !== undefined && decode !== undefined)? prefill + decode: undefined

        console.log(`rowValue col ID ${columnId}`, value)
        if(mode === "prefill")
            return maxIfDoesNotExist(prefill)
        if(mode === "decode")
            return maxIfDoesNotExist(decode)
        if(mode === "total")
            return maxIfDoesNotExist(total)
        if(mode === "energy")
            return maxIfDoesNotExist(value?.energy)
        return value ? value.energy ?? maxValue: maxValue
    }

    const [rowAValue, rowBValue] = [getRowValue(rowA), getRowValue(rowB)]

    if (rowAValue === rowBValue) return 0;
    return rowAValue < rowBValue ? -1 : 1;
}

export const getColumns = (mode: DisplayMode, sortByEnergy: boolean = false): ColumnDef<Inference>[] => 
    [
        {
            accessorKey: "phone",
            header: "Smartphone",
    
            cell: ({ row }: { row: Row<Inference> }) =>
                (row.getValue("phone") as Phone).phone_model,
    
            enableSorting: true
        },
        getColumnDef("result", mode, sortByEnergy),
    ]

function getColumnDef(rowName: string, mode: DisplayMode, sortByEnergy: boolean): ColumnDef<Inference> {
    return {
        accessorKey: rowName,
        header: getHeader(),
        cell: getRowValue(rowName, mode),
        sortingFn: getSortingFn(sortByEnergy ? "energy": mode),
        enableSorting: true,
    }
}

function getRowValue(pickedRow: string, mode: DisplayMode) {
    return ({ row }: { row: Row<Inference> }) => {

        const { dictionary } = useDictionary()
        const { llmRanking: dict} = dictionary

        const value = row.getValue(pickedRow) as LLMResult | null
        const { showSamples, showPowerAndEnergy } = value ?? { showSamples: true, showPowerAndEnergy: true }
        
        const invalidErrorMode = () => { throw Error("Invalid mode") }
        
        const prefill = value?.prefill
        const decode = value?.decode
        const total = (prefill !== undefined && decode !== undefined)? prefill + decode: undefined

        const toksRaw = 
            mode === "decode"? 
                decode: 
            mode === "prefill"?
                prefill:
            mode === "total"?
                total:
                invalidErrorMode()

        const toks = toksRaw ? `${toksRaw.toFixed(2)} tok/s` : "-"

        const numSamples =
            !showSamples ?
                null :
                value?.samples ?
                    `${formatNumber(value.samples)} ${value.samples === 1 ? dict.table.conversation.singular : dict.table.conversation.plural}` :
                    dict.table.unavailable.conversatiosnNumber

        const power =
            !showPowerAndEnergy ?
                null :
                (value?.power && value.energy) ?
                    `⚡${value.power.toFixed(2)}W | ${value.energy?.toFixed(2)}J` :
                    dict.table.unavailable.powerAndEnergy

        return (
            <div className="flex flex-1 justify-center">
                <Button
                    variant="ghost"
                    className="italic min-w-52"
                >
                    {
                        value !== null ?

                            <div className="flex flex-col gap-y-1 w-100">
                                <p className={`text-${numSamples !== null ? "base" : "base"}`}>{toks}</p>
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

function getHeader() {
    return ({ column }: { column: Column<Inference> }) => {

        const { dictionary: dict } = useDictionary()

        const sortStatus = column.getIsSorted()
        const isSelected = sortStatus !== false
        const iconClass = "ml-2 h-4 w-4"

        return (
            <div className="flex flex-1 justify-center">
                <Button
                    variant={isSelected ? "default" : "ghost"}
                    onClick={() => column.toggleSorting(sortStatus === "asc")}
                >
                    {dict.llmRanking.table.columns.result.header}
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
