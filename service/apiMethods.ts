import { MessageData } from "@/utils/module";

export async function getUserChat({ token, id }: { token: string | undefined; id: string | undefined | null }): Promise<MessageData> {
  console.log("token:",token,id);
  try {
    const response = await fetch(
      `http://localhost:4700/api/v1/chat/getUserChat/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    console.log("response",response);

    const chat= await response.json(); 
    return chat;
  } catch (error) {
    console.error("Error fetching users:", error);
    return {data:[]};
  }
}
