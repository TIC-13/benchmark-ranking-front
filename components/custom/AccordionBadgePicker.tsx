
import { useState, useEffect } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Category } from "@/app/visionRanking/page";
import { BadgePickerContent, BadgePickerProps } from "./BadgePicker";

type AccordionBadgeSelectorProps<T> = BadgePickerProps<T>

export default function AccordionBadgeSelector<T>({ className, data, setData, title, getItemName, showItem = (item) => true}: AccordionBadgeSelectorProps<T>) {

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
            className={className}
            value={title}
        >
            <AccordionTrigger>
                <div className="flex flex-1 flex-row justify-between items-center flex-wrap">
                    {title}
                    <div className="flex items-center space-x-2 pr-5">
                        <Switch
                            id="check"
                            checked={checked}
                            onCheckedChange={(checked: boolean) => {
                                onCheckedChange(checked)
                                //checked ? openSelf() : closeSelf()
                            }}
                            onClick={(event) => event.stopPropagation()}
                        />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <BadgePickerContent
                    data={data}
                    setData={setData}
                    getItemName={getItemName}
                    showItem={showItem}
                />
            </AccordionContent>
        </AccordionItem>
    );
}

export function useAccordionBadgePicker(categories: Category[]) {
    const [items, setItems] = useState(categories.map(category => category.label))
    const addItem = (item: string) => setItems([...items, item])
    const removeItem = (item: string) => setItems(items.filter(i => i !== item))

    return { items, setItems, addItem, removeItem }
}