import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type RadioItem<T extends string> = {
    value: T,
    label: string
}

type RadioButtonsGroupProps<T extends string> = {
    items: RadioItem<T>[],
    setPickedItem: (value: T) => void,
    bold?: boolean
}

function RadioButtonsGroup<T extends string>({ items, setPickedItem, bold=false }: RadioButtonsGroupProps<T>) {
    return (
        <RadioGroup
            defaultValue={items[0].value}
            onValueChange={(val) => setPickedItem(val as T)}
            className="flex flex-wrap justify-between items-center gap-y-5"
        >
            {
                items.map(({ value, label }) =>
                    <div key={value} className="flex flex-1 items-center space-x-2">
                            <RadioGroupItem value={value} id={value} />
                            <Label htmlFor={value} className="flex-1 w-20">
                                {
                                    bold ? <strong>{label}</strong> : label
                                }
                            </Label>
                    </div>
                )
            }
        </RadioGroup>
    )
}

export default RadioButtonsGroup