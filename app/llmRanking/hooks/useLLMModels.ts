import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type LLMModel = {
    name: string
}

const useLLMModels = () => 
    useQuery({
        queryKey: ["llmModels"],
        queryFn: async () => (await axios.get<LLMModel[]>(`${process.env.NEXT_PUBLIC_API}/llmInference/models`)).data
    })

export default useLLMModels