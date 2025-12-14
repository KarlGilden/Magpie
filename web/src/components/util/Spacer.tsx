interface Props {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Spacer = ({ size = "sm" }: Props) => {
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
        <div className={`p-${padding}`} />
    )
}

export default Spacer;