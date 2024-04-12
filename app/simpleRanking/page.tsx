'use client'

import React from "react"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Ranking() {


    const runningModes = ["CPU", "GPU", "NNAPI"]

    const { isLoading, data: ranking } = useQuery({
        queryKey: ["simpleRanking"],
        queryFn: async () => (await axios.get(`http://localhost:3030/phone/get/simpleRanking`)).data,
        retry: false,
    })

    if (isLoading || ranking === undefined)
        return (
            <div>Carregando</div>
        )

    return (
        <main className="min-h-screen p-24 gap-20">
            <table className="flex-none table-auto border-collapse">
                <thead>
                    <tr className="gap-x-3">
                        <TableHeader text="Smartphone" rowSpan={1} />
                        {
                            runningModes.map(mode =>
                                <TableHeader text={`${mode}`} />
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        ranking.map((entry: any) =>
                            <tr>
                                <TableEntry text={`${entry.phone.phone_model}`} />
                                {
                                    runningModes.map(mode => 
                                        <TableEntry text={
                                            entry[mode] !== null? 
                                                `${entry[mode]} ms`: 
                                                "-"
                                            }
                                        />
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

