import { useState } from "react";

type FormValues = Record<string, string>; 
type FormErrors = Record<string, string>; 

export function useForm<T extends FormValues>(
    initialValues: T,
    validate: (values: T) => FormErrors
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});

    function handleChange(field: keyof T, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
}

function handleSubmit(onValid: (values: T) => void) {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
        onValid(values);
        }
    }
    
    return { values, errors, handleChange, handleSubmit };
}