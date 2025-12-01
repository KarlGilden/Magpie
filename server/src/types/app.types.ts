export interface WordCaptureResponse {
    words: WordPhrase[];
    phrases: WordPhrase[];
}

interface WordPhrase {
    text: string;
    translations: string[];
}