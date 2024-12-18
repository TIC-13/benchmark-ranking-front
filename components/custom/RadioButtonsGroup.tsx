import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type RadioItem<T extends string> = {
    value: T,
    label: string
}

type RadioButtonsGroupProps<T extends string> = {
    items: RadioItem<T>[],
    setPickedItem: (value: T) => void
}

function RadioButtonsGroup<T extends string>({ items, setPickedItem }: RadioButtonsGroupProps<T>) {
    return (
        <RadioGroup
            defaultValue={items[0].value}
            onValueChange={(val) => setPickedItem(val as T)}
            className="flex flex-1 flex-row justify-between items-center flex-wrap gap-y-5"
        >
            {
                items.map(({ value, label }) =>
                    <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value} />
                        <Label htmlFor={value} className="w-20">{label}</Label>
                    </div>
                )
            }
        </RadioGroup>
    )
}

export default RadioButtonsGroup