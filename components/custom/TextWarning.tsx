import { CircleAlert } from "lucide-react";
import { TypographyP } from "../typography/Typography";

type TextWarningProps = {
    text: string
}

export default function TextWarning({text}: TextWarningProps) {
    return (
        <div className="flex items-center gap-x-2">
            <CircleAlert className="text-warning-foreground" />
            <TypographyP
                className="m-0 text-warning-foreground font-bold"
                text={text}
            />
        </div>
    )
} 