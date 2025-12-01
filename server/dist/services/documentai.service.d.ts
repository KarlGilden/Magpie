import { DocumentAIConfig, ValidationResult, ProcessDocumentFunction, GetStatusFunction, ValidateConfigFunction } from '../types/documentai.types';
export declare const validateConfig: ValidateConfigFunction;
export declare const processDocument: (config: DocumentAIConfig) => ProcessDocumentFunction;
export declare const getStatus: (config: DocumentAIConfig) => GetStatusFunction;
export declare const createDocumentAIService: (config: DocumentAIConfig) => {
    processDocument: ProcessDocumentFunction;
    getStatus: GetStatusFunction;
    validateConfig: () => ValidationResult;
};
//# sourceMappingURL=documentai.service.d.ts.map