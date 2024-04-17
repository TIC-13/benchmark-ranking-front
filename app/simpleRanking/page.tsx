'use client'

import React from "react"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { DataTable } from "./data-table";
import { Inference, Phone, columns } from "./columns";

const mockData: Inference[] = [
    {
        phone: {
            id: 1,
            phone_model: "Samsung A14",
            brand_name: "samsung"
        },
        CPU: 30,
        GPU: 15, 
        NNAPI: 20
    },
    {
        phone: {
            id: 1,
            phone_model: "Xiaomi MI13",
            brand_name: "xiaomi"
        },
        CPU: 20,
        GPU: 22, 
        NNAPI: 41
    },
    {
        phone: {
            id: 1,
            phone_model: "Moto G30",
            brand_name: "motorola"
        },
        CPU: 25,
        GPU: 17, 
        NNAPI: 16
    },
]


export default function Ranking() {

    const { isLoading, data: ranking } = useQuery<Inference[]>({
        queryKey: ["simpleRanking"],
        queryFn: async () => (await axios.get(`http://localhost:3030/phone/get/simpleRanking`)).data,
        retry: false,
    })

    if (isLoading || ranking === undefined)
        return (
            <div>Carregando</div>
        )

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={mockData} />
        </div>
    )
}


