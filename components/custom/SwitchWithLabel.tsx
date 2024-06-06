import { Switch } from "../ui/switch";

type SwitchWithLabelProps = {
    label: string,
    checked: boolean,
    onCheckedChange: (val: boolean) => void
}

function SwitchWithLabel({label, checked, onCheckedChange}: SwitchWithLabelProps) {
    return (
        <div className="flex flex-row gap-x-5">
            <p>{label}</p>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    )
}

export default SwitchWithLabel