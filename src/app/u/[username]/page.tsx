// "use client";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { toast, useToast } from "@/components/ui/use-toast";
// import dbConnect from "@/lib/dbConnect";
// import { useParams } from "next/navigation";
// import React, { useState } from "react";
// import User, { Message } from "@/model/User";
// import axios from "axios";
// import { apiResponse } from "@/types/apiRes";
// import { messageSchema } from "@/schemas/messageSchema";
// import { z } from "zod";

// const SendMessagePage = () => {
//   const [messageToSend, setMessageToSend] = useState("");

//   const { toast } = useToast();
//   const params = useParams<{ username: string }>();
//   const username = params.username;

//   const sendMessageToUser = async (data: z.infer<typeof messageSchema>) => {
//     await dbConnect();

//     try {
//       const sendMessage = await axios.post<apiResponse>("/api/send-message", {
//         ...data,
//         username,
//       });

//       toast({
//         title: sendMessage.data.message,
//         variant: "default",
//       });
//     } catch (error) {
//       toast({
//         title: "Erroroccured while sending data to the user",
//         variant: "default",
//       });
//     }
//   }

//   return (
//     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//       <h1 className="text-4xl font-bold mb-4">Public Profile Page</h1>

//       <div className="mb-4">
//         <h2 className="text-lg font-semibold mb-2">
//           Send anonymous message to {username}
//         </h2>{" "}
//         <div className="flex flex-col items-center">
//           <input
//             type="text"
//             onChange={(e) => setMessageToSend(e.target.value)}
//             placeholder="type a message..."
//             className="input input-bordered w-full p-2 mb-4 rounded-xl"
//           />
//           <Button className="mx-auto" onClick={sendMessageToUser}>
//             Send
//           </Button>
//         </div>
//       </div>
//       <div className="flex flex-col items-center">
//         <Separator className="mb-4" />
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <div className="flex justify-center mt-20">
//               <Button variant="outline">Generate random messages</Button>
//             </div>
//           </AlertDialogTrigger>
//           <AlertDialogContent className="mt-4">
//             <AlertDialogHeader>
//               <AlertDialogTitle>Sorry Guys!!</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be performed as my API Tokens for ChatGPT are
//                 over 😢🥺
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogAction>Go Back</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </div>
//   );

// };

// export default SendMessagePage;

"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { apiResponse } from "@/types/apiRes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<apiResponse>("/api/send-message", {
        ...data,
        username,
      });
      console.log("DATA!!!!1:", response);

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {};

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
