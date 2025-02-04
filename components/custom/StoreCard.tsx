import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link"; // Import Link if using Next.js

export type StoreCardProps = {
    title: string,
    text: string,
    imgSrc: string,
    classname?: string,
    link: string,
}

export function StoreCard({ title, text, imgSrc, link, classname }: StoreCardProps) {
    return (
        <Link
            className={cn("rounded-md block border p-4 hover:bg-accent hover:text-accent-foreground transition-colors", classname)}
            href={link}
            target="_black"
        >
            <div className="flex justify-between items-center space-x-4">
                <Avatar>
                    <AvatarImage src={imgSrc} />
                    <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="text-sm">
                        {text}
                    </p>
                </div>
            </div>
        </Link>
    )
}