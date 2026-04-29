import { Suspense } from "react";
import { ResultClient } from "./result-client";
import ResultLoading from "./loading";

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultLoading />}>
      <ResultClient />
    </Suspense>
  );
}
