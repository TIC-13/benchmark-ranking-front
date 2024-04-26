import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useModels = () => 
    useQuery({
        queryKey: ["models"],
        queryFn: async () => (await axios.get<string[]>("http://localhost:3030/inference/get/models")).data
    })

export default useModels