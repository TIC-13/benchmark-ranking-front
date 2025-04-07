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
    energy?: number,
    samples?: number,
    gpu?: number,
    cpu?: number,
    ram?: number,
    showSamples: boolean,
}

type LLMResultNumerics = Omit<LLMResult, "showSamples">

export type Phone = {
    id: number,
    brand_name: string,
    phone_model: string
}

export type DisplayMode = "prefill" | "decode" | "cpu" | "gpu" | "ram"

export function isDisplayMode(mode: string): mode is DisplayMode {
    return (
        mode === "prefill" ||
        mode === "decode" ||
        mode === "cpu" ||
        mode === "gpu" ||
        mode === "ram"
    );
}

function formatValue(value: number | undefined | null, unit: string): string {
    return value !== undefined && value !== null ? `${value.toFixed(2)} ${unit}` : "-";
}

function numericGetter(prop: keyof LLMResultNumerics): (v: LLMResultNumerics | null) => number | undefined {
    return (v) => v?.[prop];
}

const displayModeConfigs: Record<DisplayMode, {
    getValue: (value: LLMResult | null) => number | undefined,
    getDisplayValue: (value: LLMResult | null) => string,
    sortMode: "asc" | "desc"
}> = {
    prefill: {
        getValue: numericGetter("prefill"),
        getDisplayValue: (v) => formatValue(v?.prefill ? parseFloat((v.prefill/1000).toFixed(1)): null, "s"),
        sortMode: "asc"
    },
    decode: {
        getValue: numericGetter("decode"),
        getDisplayValue: (v) => formatValue(v?.decode, "tok/s"),
        sortMode: "desc"
    },
    cpu: {
        getValue: numericGetter("cpu"),
        getDisplayValue: (v) => formatValue(v?.cpu, "%"),
        sortMode: "asc"
    },
    gpu: {
        getValue: numericGetter("gpu"),
        getDisplayValue: (v) => formatValue(v?.gpu, "%"),
        sortMode: "asc"
    },
    ram: {
        getValue: numericGetter("ram"),
        getDisplayValue: (v) => formatValue(v?.ram, "MB"),
        sortMode: "asc"
    }
};

const getSortingFn = (mode: DisplayMode) => (rowA: Row<Inference>, rowB: Row<Inference>, columnId: string) => {

    const config = displayModeConfigs[mode]
    const isAsc = config.sortMode === "asc"
    const isAscMultiplier = isAsc? -1: 1

    const sortStatus = rowA.getAllCells()
        .find(cell => cell.column.id === columnId)
        ?.column
        .getIsSorted() ?? false

    const maxValue = -99999999 * (sortStatus === "asc" ? -1 : 1) * isAscMultiplier
    const maxIfDoesNotExist = (number: number | undefined) => number !== undefined && number !== null && number !== 0? number : maxValue

    const getRowValue = (row: Row<Inference>) => {
        const value = row.getValue<LLMResult | null>(columnId)
        return maxIfDoesNotExist(value !== null && value !== undefined? config.getValue(value): undefined)
    }

    const [rowAValue, rowBValue] = [getRowValue(rowA), getRowValue(rowB)]

    if (rowAValue === rowBValue) return 0;
    return (rowAValue < rowBValue ? -1 : 1)*isAscMultiplier;
}

export const getColumns = (mode: DisplayMode): ColumnDef<Inference>[] =>
    [
        {
            accessorKey: "phone",
            header: "Smartphone",
            cell: ({ row }: { row: Row<Inference> }) =>
                (row.getValue("phone") as Phone).phone_model,
            enableSorting: true
        },
        getColumnDef("result", mode),
    ]

function getColumnDef(rowName: string, mode: DisplayMode): ColumnDef<Inference> {

    return {
        accessorKey: rowName,
        header: getHeader(),
        cell: getRowValue(rowName, mode),
        sortingFn: getSortingFn(mode),
        enableSorting: true,
    }
}

function getRowValue(pickedRow: string, mode: DisplayMode) {
    return ({ row }: { row: Row<Inference> }) => {
        const { dictionary } = useDictionary()
        const { llmRanking: dict } = dictionary

        const value = row.getValue(pickedRow) as LLMResult | null
        const { showSamples } = value ?? { showSamples: true }

        const displayValue = displayModeConfigs[mode].getDisplayValue(value)

        const numSamples =
            !showSamples ? null :
                value?.samples ?
                    `${formatNumber(value.samples)} ${value.samples === 1 ? dict.table.conversation.singular : dict.table.conversation.plural}` :
                    dict.table.unavailable.conversatiosnNumber

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
                                {numSamples && <p className="text-xs">{numSamples}</p>}
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
                            (sortStatus === "asc" ? <ArrowDown className={iconClass} /> : <ArrowUp className={iconClass} />)
                            : <ArrowUpDown className={iconClass} />
                    }
                </Button>
            </div>
        )
    }
}
