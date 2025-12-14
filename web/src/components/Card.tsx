import type { ReactNode } from "react";

interface Props {
    children: ReactNode,
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    muted?: boolean
}

const Card = ({ children, size = "sm", muted = false }: Props) => {
    let padding = 1
    
    switch(size) {
        case "xs":
            padding = 1;
            break;
        case "sm":
            padding = 2;
            break;
        case "md":
            padding = 4;
            break;
        case "lg":
            padding = 6;
                break;
        case "xl":
            padding = 8;
            break;
    }
    return (
        <div className={`rounded-xl border border-border bg-card${muted ? "-muted" : ""} p-${padding} shadow-sm`}>
            {children}
        </div>
    )
}

export default Card;