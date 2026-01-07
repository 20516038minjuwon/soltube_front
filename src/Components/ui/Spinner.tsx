import { twMerge } from "tailwind-merge";

type SpinnerProps = {
    color?: "primary" | "secondary"|"info" | "success" | "warning" | "error"|"disabled";
}
function Spinner({color= "primary" }: SpinnerProps) {
    const colorClasses={
        primary:"border-primary-main",
        secondary:"border-secondary-main",
        info:"border-info-main",
        success:"border-success-main",
        warning:"border-warning-main",
        error:"border-error-main",
        disabled:"border-text-disabled",
    }
    return<div className={twMerge(
        ['w-6','h-6','border-2','border-text-disabled'],
        ['border-t-transparent','rounded-full','animate-spin'],
        colorClasses[color]
    )}>

    </div>
}
export default Spinner;