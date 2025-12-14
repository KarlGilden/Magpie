interface Props {
    content: string;
    type?: "button" | "submit";
    onClick?: () => void
    styleType?: "primary" | "normal";
    isLoading?: boolean;
    loadingContent?: string;
    disabled?: boolean;
}

const Button = ({ 
    content, 
    type = "button", 
    onClick = () => {},
    isLoading = false, 
    loadingContent = "Loading...", 
    disabled = false,
    styleType = "normal"
}: Props) => {
    const typeStyles = styleType === "primary" ? "bg-accent" : "border border-border text-text hover:border-accent transition-colors";
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`px-6 py-2 rounded-lg ${typeStyles} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {loadingContent}
              </>
            ) : (
              content
            )}
          </button>
    )
};

export default Button;