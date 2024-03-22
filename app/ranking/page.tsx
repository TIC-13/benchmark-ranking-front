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
    speed: number | null
}


export default async function Ranking() {

    
    let response = await axios.post<RankingEntry[]>('http://localhost:3030/phone/get/ranking', {
        models: ["Mobilenet", "DeepLab"],
        quantizations: ["INT8", "FP32"]
    })
    const ranking = response.data.filter(x => x.phone.brand_name !== "")

    return (
        <main className="min-h-screen p-24">
            <table className="flex-none border-separate">
                <thead>
                    <tr className="gap-x-3">
                        <TableHeader text = "Smartphone"/>
                        {
                            ranking.length > 0 &&
                            ranking[0].results.map((result) => 
                                <TableHeader text = {`${result.model} - ${result.quantization}`}/>
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
    text: string
}

const TableHeader: React.FC<TableLineParams> = ({text}) => {
    return (
        <th>
            <div className="bg-blue-500 text-white rounded-2xl p-5 text-center">
                {text}
            </div>
            
        </th>
    )
}

const TableEntry: React.FC<TableLineParams> = ({text}) => {
    return (
        <td>
            <div className="bg-green-500 text-white rounded-2xl p-5 text-center">
                {text}
            </div>
            
        </td>
    )
}
