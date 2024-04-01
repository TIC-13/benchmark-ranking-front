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

const modeOptions = [
    { key: "CPU", label: "CPU" },
    { key: "GPU", label: "GPU" },
    { key: "NNAPI", label: "NNAPI" }
]

const quantizationOptions = [
    { key: "INT8", label: "INT8" },
    { key: "FP32", label: "FP32" },
]

const modelsOptions = [
    { key: "Mobilenet", label: "Mobilenet" },
    { key: "Deeplab", label: "Deeplab" },
]

const manufacturerOptions = [
    { key: "Samsung", label: "Samsung" },
    { key: "Motorola", label: "Motorola" }
]

export default function Ranking() {

    const [models, setModels] = useState(modelsOptions.map(x => x.label));
    const [quantizations, setQuantizations] = useState(quantizationOptions.map(x => x.label));
    const [modes, setModes] = useState(modeOptions.map(x => x.label));
    const [manufacturers, setManufacturers] = useState(manufacturerOptions.map(x => x.label));

    const rankingQuery = useRanking(models, quantizations, modes, manufacturers)
    const [ranking, setRanking] = useState<RankingEntry[] | undefined>(undefined)

    useEffect(() => {
        if(rankingQuery.data !== undefined)
            setRanking(rankingQuery.data)
    }, [rankingQuery.data])

    if(ranking === undefined)
        return (
            <div>Carregando</div>
        )

    return (
        <main className="min-h-screen p-24 gap-20">
            <div>
                <span>Selecione os modelos</span>
                <DropdownMultiple
                    selectedKeys={new Set(models)}
                    setSelectedKeys={(val: Set<string>) => setModels(Array.from(val))}
                    options={modelsOptions}
                />
            </div>
            <div>
                <span>Selecione as quantizações</span>
                <DropdownMultiple
                    selectedKeys={new Set(quantizations)}
                    setSelectedKeys={(val: Set<string>) => setQuantizations(Array.from(val))}
                    options={quantizationOptions}
                />
            </div>
            <div>
                <span>Selecione os modos de rodar</span>
                <DropdownMultiple
                    selectedKeys={new Set(modes)}
                    setSelectedKeys={(val: Set<string>) => setModes(Array.from(val))}
                    options={modeOptions}
                />
            </div>
            <div>
                <span>Selecione as marcas</span>
                <DropdownMultiple
                    selectedKeys={new Set(manufacturers)}
                    setSelectedKeys={(val: Set<string>) => setManufacturers(Array.from(val))}
                    options={manufacturerOptions}
                />
            </div>
            <table className="flex-none table-auto border-collapse">
                <thead>
                    <tr className="gap-x-3">
                        <TableHeader text="Smartphone" rowSpan={3} />
                        {
                            ranking !== undefined && ranking.length > 0 &&
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
                        (ranking ?? []).map(entry =>
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

