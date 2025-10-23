import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useState } from "react";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  // اگر بخوای QueryClient روی هر رندر تازه ایجاد بشه:
  // const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;