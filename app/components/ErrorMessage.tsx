interface ErrorMessageProps {
    msg: string;
}

const ErrorMessage = ({ msg }: ErrorMessageProps) => {
    return (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {msg}
        </div>
    );
}

export default ErrorMessage;