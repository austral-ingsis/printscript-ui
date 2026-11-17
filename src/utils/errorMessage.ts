import axios from "axios";

/**
 * Extrae un mensaje legible de un error de Axios o Error estándar.
 */
export function getApiErrorMessage(error: unknown, fallback = "Unexpected error"): string {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 403) {
            return "You don't have permission to perform this action";
        }
        if (status === 404) {
            return "Resource not found";
        }

        const data = error.response?.data as unknown;
        if (Array.isArray(data)) {
            const messages = data
                .map((item) => (typeof item === "object" && item !== null && "message" in item ? String((item as { message: unknown }).message) : null))
                .filter((msg): msg is string => Boolean(msg));
            if (messages.length > 0) {
                return messages.join(" | ");
            }
        }
        if (typeof data === "object" && data !== null) {
            const record = data as Record<string, unknown>;
            if (typeof record.error === "string" && record.error.trim()) {
                return record.error;
            }
            if (typeof record.message === "string" && record.message.trim()) {
                return record.message;
            }
        }
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallback;
}
