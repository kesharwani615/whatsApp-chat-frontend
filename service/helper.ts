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