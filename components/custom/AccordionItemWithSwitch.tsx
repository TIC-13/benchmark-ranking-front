
import { useState, useEffect } from "react"
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface Selectable<T> {
    value: T,
    isSelected: boolean
}

interface SelectionProps<T> {
    labelOn?: string,
    labelOff?: string,
    data: Selectable<T>[],
    setData: React.Dispatch<React.SetStateAction<Selectable<T>[]>>,
    title: string,
    getItemName: (item: Selectable<T>) => string,
    showItem?: (item: Selectable<T>) => boolean,
}

export default function AccordionItemWithSwitch<T>({ labelOn, labelOff, data, setData, title, getItemName, showItem = (item) => true }: SelectionProps<T>) {

    const [checked, setChecked] = useState(true)

    function onCheckedChange(newChecked: boolean) {
        setData(data.map(x => {
            return { ...x, isSelected: showItem(x) ? newChecked : x.isSelected }
        }))
        setChecked(newChecked)
    }

    useEffect(() => {
        const showedItems = data.filter(x => showItem(x))
        if (showedItems.every(x => x.isSelected))
            setChecked(true)
        if (showedItems.every(x => !x.isSelected))
            setChecked(false)
    }, [data])

    return (
        <AccordionItem
            value={title}
        >
            <AccordionTrigger>
                <div className="flex flex-1 flex-row justify-between items-center flex-wrap gap-y-5">
                    {title}
                    <div className="flex items-center space-x-2 pr-5">
                        <Switch
                            id="check"
                            checked={checked}
                            onCheckedChange={onCheckedChange}
                            onClick={(event) => event.stopPropagation()}
                        />
                        <Label htmlFor="check">{checked ? labelOn : labelOff}</Label>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-row gap-x-3 gap-y-3 flex-wrap">
                {
                    data.map((x, idx) =>
                        showItem(x) &&
                        <Badge
                            variant={x.isSelected ? "default" : "outline"}
                            onClick={() =>
                                setData((prev) => {
                                    const arr = [...prev]
                                    arr[idx] = { ...arr[idx], isSelected: !prev[idx].isSelected }
                                    return arr
                                })
                            }
                        >
                            {getItemName(x)}
                        </Badge>
                    )
                }
            </AccordionContent>
        </AccordionItem>
    );
}