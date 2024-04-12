'use client'

import React from "react"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
            <Table>
                <TableCaption>Ranking de desempenho de telefones no aplicativo AI Benchmarking</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Smartphone</TableHead>
                        {
                            runningModes.map(mode =>
                                <TableHead>{`${mode}`}</TableHead>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        ranking.map((entry: any) =>
                            <TableRow>
                                <TableCell>{`${entry.phone.phone_model}`}</TableCell>
                                {
                                    runningModes.map(mode =>
                                        <TableCell>
                                            {
                                                entry[mode] !== null ?
                                                    `${entry[mode]} ms` :
                                                    "-"
                                            }
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </main>

    )
}

type TableLineParams = {
    text: string,
    rowSpan?: number,
    colSpan?: number
}

function repeatArray(arr: any[], n: number): any[] {
    return Array.from({ length: n }, () => [...arr]).flat();
}

