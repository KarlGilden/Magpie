import { useMutation } from "@tanstack/react-query";
import { useFetch } from "../useFetch";
import type { FetchVariables } from "../useFetch";

interface CaptureVariables {
  image: File;
  language: string;
}

export const useCapture = () => {
    return useMutation({
        mutationFn: async ({ image, language }: CaptureVariables) => {
            const formData = new FormData();
            formData.append('image', image);

            const variables: FetchVariables = {
                body: formData,
            };

            const fetchFn = useFetch({
                path: `/api/capture?language=${language}`,
                method: 'POST',
                contentType: 'multipart/form-data',
            });

            return fetchFn(variables);
        },
    });
};