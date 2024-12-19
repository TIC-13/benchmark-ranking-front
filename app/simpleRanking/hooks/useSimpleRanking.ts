import { useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";

export default function useSimpleRanking(models: string[], quantizations: string[]){
    return useQuery<Inference[]>({
        queryKey: ["simpleRanking", models, quantizations],
        queryFn: async () => {
            const queryString = `models=${models.join(',')}&quantizations=${quantizations.join(',')}`;
            return (await axios.get(`${process.env.NEXT_PUBLIC_API}/phone/get/simpleRanking?${queryString}`)).data
        },
        retry: false,
    })
}

