import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostContextProvider } from "./context/useContext.jsx";
import { MessageContextProvider } from "./hooks/useMessage.jsx";
import { SocketContextProvider } from "./context/Socket.jsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PostContextProvider>
     
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
          <MessageContextProvider>
            < SocketContextProvider>
            <App />
            </SocketContextProvider>
            </MessageContextProvider>

          </QueryClientProvider>
        </BrowserRouter>
    
      <Toaster />
    </PostContextProvider>
  </StrictMode>
);
