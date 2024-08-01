import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Model = {
    ml_model: string,
    category: string,
    quantizations: string[]
}

const useModels = () => 
    useQuery({
        queryKey: ["models"],
        queryFn: async () => (await axios.get<Model[]>(`${process.env.NEXT_PUBLIC_API}/inference/get/models`)).data
    })

export default useModels