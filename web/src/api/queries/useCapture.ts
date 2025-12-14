import { useQuery } from "@tanstack/react-query";
import { useFetch } from "../useFetch";
import type { WordCaptureResponse } from "../types/capture.types";
import QueryKeys from "../queryKeys";

interface CaptureVariables {
  image?: File | null;
  language?: string;
}

export const useCapture = ({ image, language }: CaptureVariables) => {
    const fetch = useFetch();

    return useQuery<WordCaptureResponse>({
        queryFn: () => {
            if(!image) throw new Error("No image selected");

            const formData = new FormData();
            formData.append('image', image);

            return fetch({
                path: `/api/capture?language=${language}`,
                method: 'POST',
                contentType: 'multipart/form-data',
                body: formData
            });
        },
        queryKey: [QueryKeys.CAPTURE.ROOT(image ?? null, language ?? "")],
        enabled: false
    });
};