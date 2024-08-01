import { useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";

export default function useLLMRanking(){
    return useQuery<Inference[]>({
        queryKey: ["llmRanking"],
        queryFn: async () => 
            (await axios.get(`${process.env.NEXT_PUBLIC_API}/llmInference/ranking`)).data,
        retry: false
    })
}

