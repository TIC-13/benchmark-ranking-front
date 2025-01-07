import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ReactNode } from "react"


type CardProps = {
    children: ReactNode,
    title: string,
    subtitle?: string,
    className?: string,
    titleClassName?: string
    contentClassName?: string
}

export default function DefaultCard({ children, title, subtitle, className, contentClassName, titleClassName }: CardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className={titleClassName}>{title}</CardTitle>
                {
                    subtitle !== undefined &&
                    <CardDescription>{subtitle}</CardDescription>
                }
            </CardHeader>
            <CardContent className={contentClassName}>
                {children}
            </CardContent>
        </Card>
    )
}