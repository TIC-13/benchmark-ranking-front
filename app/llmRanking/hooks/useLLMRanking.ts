import { useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";

export default function useLLMRanking(){
    return useQuery<Inference[]>({
        queryKey: ["llmRanking"],
        queryFn: async () => 
            (await axios.get(`http://localhost:3030/llmInference/ranking`)).data,
        retry: false
    })
}

