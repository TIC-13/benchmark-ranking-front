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
        queryFn: async () => (await axios.get<Model[]>("http://localhost:3030/inference/get/models")).data
    })

export default useModels