import dayjs from "dayjs";

export const getToken = async (name: string) => {
    if (typeof window === "undefined") {
        // Server-side
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const token = cookieStore.get(name)?.value;
        console.log("Server-side token:", token);
        return token;
    } else {
        // Client-side
        const { getCookie } = await import("cookies-next");
        const token = getCookie("whatsApp");
        console.log("Client-side token:", token);
        return token;
    }
};

export const formatTime = (dateString: string) => {
    return dayjs(dateString).format('h:mm A');
};

export const getUserIdFromToken = (token: string): string | null => {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        const payload = JSON.parse(jsonPayload);
        return payload._id || null;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

