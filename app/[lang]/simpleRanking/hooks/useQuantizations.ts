import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useModels = () => 
    useQuery({
        queryKey: ["quantizations"],
        queryFn: async () => (await axios.get<string[]>("http://localhost:3030/inference/get/quantizations")).data
    })

export default useModels