const QueryKeys = {
    CAPTURE: {
        ROOT: (image: File | null, language: string) => ["capture", image, language]
    }
}

export default QueryKeys;