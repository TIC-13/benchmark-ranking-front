'use client'

import React, { useEffect, useState } from "react"
import useRanking from "./hooks/useRanking"
import DropdownMultiple from "../src/DropdownMultiple";

type Phone = {
    brand_name: string
}

export type RankingEntry = {
    phone: Phone,
    results: RankingResultEntry[]
}

type RankingResultEntry = {
    model: string,
    quantization: string,
    speed: number | null,
    mode: string
}


export default function Ranking() {

    const [models, setModels] = useState(["Mobilenet", "DeepLab"]);
    const [quantizations, setQuantizations] = useState(["INT8", "FP32"]);
    const [modes, setModes] = React.useState(["CPU", "GPU", "NNAPI"]);

    const modeOptions = [
        { key: "CPU", label: "CPU" },
        { key: "GPU", label: "GPU" },
        { key: "NNAPI", label: "NNAPI" }
    ]

    const { data: ranking, isLoading, isError, refetch, isRefetching } = useRanking(models, quantizations, modes)

    if (isLoading || isRefetching)
        return (
            <div>Carregando</div>
        )

    if (isError || ranking === undefined)
        return (
            <div>Erro </div>
        )

    return (
        <main className="min-h-screen p-24 gap-20">
            <div>
                <span>Selecione os modos de rodar</span>
                <DropdownMultiple
                    selectedKeys={new Set(modes)}
                    setSelectedKeys={(val: Set<string>) => setModes(Array.from(val))}
                    options={modeOptions}
                />
            </div>

            <table className="flex-none table-auto border-collapse">
                <thead>
                    <tr className="gap-x-3">
                        <TableHeader text="Smartphone" rowSpan={3} />
                        {
                            ranking.length > 0 &&
                            models.map((model) =>
                                <TableHeader text={`${model}`} colSpan={quantizations.length * modes.length} />
                            )
                        }
                    </tr>
                    <tr>
                        {
                            repeatArray(quantizations, models.length).map(quantization =>
                                <TableHeader text={quantization} colSpan={modes.length} />
                            )
                        }
                    </tr>
                    <tr>
                        {
                            repeatArray(modes, models.length * quantizations.length).map(mode =>
                                <TableHeader text={mode} />
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        ranking.map(entry =>
                            <tr>
                                <TableEntry text={entry.phone.brand_name} />
                                {
                                    entry.results.map(result =>
                                        <TableEntry text={`${result.speed !== null ? result.speed : "-"}`} />
                                    )
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </main>

    )
}

type TableLineParams = {
    text: string,
    rowSpan?: number,
    colSpan?: number
}

const TableHeader: React.FC<TableLineParams> = ({ text, rowSpan = 1, colSpan = 1 }) => {
    return (
        <th className="border-2 border-black" rowSpan={rowSpan} colSpan={colSpan}>
            <div className="text-black rounded-2xl p-5 text-center">
                {text}
            </div>
        </th>
    )
}

const TableEntry: React.FC<TableLineParams> = ({ text, rowSpan = 1, colSpan = 1 }) => {
    return (
        <td className="border-2 border-black" rowSpan={rowSpan} colSpan={colSpan}>
            <div className="text-black rounded-2xl p-5 text-center">
                {text}
            </div>

        </td>
    )
}

function repeatArray(arr: any[], n: number): any[] {
    return Array.from({ length: n }, () => [...arr]).flat();
}

