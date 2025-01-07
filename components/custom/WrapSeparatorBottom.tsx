import { Separator } from "./Separator"



type WrapSeparatorBottomProps = {
    children: React.ReactNode
}

export default function WrapSeparatorBottom({ children }: WrapSeparatorBottomProps) {
    return (
        <>
            {children}
            <Separator />
        </>
    )
}