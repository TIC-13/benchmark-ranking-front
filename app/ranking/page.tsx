import axios from "axios"
import React from "react"

type Phone = {
    brand_name: string
}

type RankingEntry = {
    phone: Phone,
    results: RankingResultEntry[]
}

type RankingResultEntry = {
    model: string,
    quantization: string,
    speed: number | null,
    mode: string
}


export default async function Ranking() {

    const models = ["Mobilenet", "DeepLab"];
    const quantizations = ["INT8", "FP32"];
    const modes = ["NNAPI", "CPU"];

    let response = await axios.post<RankingEntry[]>('http://localhost:3030/phone/get/ranking', {models, quantizations, modes})
    const ranking = response.data.filter(x => x.phone.brand_name !== "")

    return (
        <main className="min-h-screen p-24">
            <table className="flex-none table-auto border-collapse">
                <thead>
                    <tr className="gap-x-3">
                        <TableHeader text = "Smartphone"/>
                        {
                            ranking.length > 0 &&
                            ranking[0].results.map((result) => 
                                <TableHeader text = {`${result.model} - ${result.quantization} - ${result.mode}`}/>
                            )
                        }

                    </tr>
                </thead>
                <tbody>
                    {
                        ranking.map(entry =>
                                <tr>
                                    <TableEntry text = {entry.phone.brand_name}/>
                                    {
                                        entry.results.map(result => 
                                            <TableEntry text = {`${result.speed !== null ? result.speed: "-"}`}/>
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

const TableHeader: React.FC<TableLineParams> = ({text, rowSpan = 1, colSpan = 1}) => {
    return (
        <th className="border-2 border-black" rowSpan={rowSpan} colSpan={colSpan}>
            <div className="text-black rounded-2xl p-5 text-center">
                {text}
            </div>
        </th>
    )
}

const TableEntry: React.FC<TableLineParams> = ({text, rowSpan = 1, colSpan = 1}) => {
    return (
        <td className="border-2 border-black" rowSpan={rowSpan} colSpan={colSpan}>
            <div className="text-black rounded-2xl p-5 text-center">
                {text}
            </div>
            
        </td>
    )
}
