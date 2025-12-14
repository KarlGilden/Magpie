import { useState, useRef, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { useCapture } from '../api/queries/useCapture';
import Card from '../components/Card';
import Spacer from '../components/util/Spacer';
import Button from '../components/Button';

const Capture = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>('es');
  const [preview, setPreview] = useState<string | null>(null);

  const [acceptedWords, setAcceptedWords] = useState<string[]>([]);
  const [acceptedPhrases, setAcceptedPhrases] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: captureData, refetch: getCaptureData, isLoading: isCaptureDataLoading, isError: isCaptureDataError, error: captureDataError } = useCapture({
    image: selectedFile,
    language
  });

  useEffect(() => {
    if(!captureData) return;

    setAcceptedWords(captureData.words.map(word => {
      return word.text;
    }))

    setAcceptedPhrases(captureData.phrases.map(phrase => {
      return phrase.text;
    }))
  }, [captureData])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    if (!language) {
      alert('Please select a language');
      return;
    }

    try {
      await getCaptureData();
    } catch (error) {
      console.error('Capture error:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAcceptSelection = () => {
    
  }

  const toggleAcceptedWord = (word: string) => {
    if(acceptedWords.includes(word)){
      return setAcceptedWords(acceptedWords.filter(x => x !== word))
    }

    setAcceptedWords([...acceptedWords, word])
  }

  const toggleAcceptedPhrases = (phrase: string) => {
    if(acceptedPhrases.includes(phrase)){
      return setAcceptedPhrases(acceptedPhrases.filter(x => x !== phrase))
    }

    setAcceptedWords([...acceptedPhrases, phrase])
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-text">Capture</h1>
        <p className="text-lg text-muted">
          Upload an image to extract text and generate translations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card size='xl'>
          {/* Language Selector */}
          <div className="mb-6">
            <label htmlFor="language" className="block text-sm font-medium text-text mb-2">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>

          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              preview
                ? 'border-border'
                : 'border-border hover:border-accent cursor-pointer'
            }`}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="absolute top-2 right-2 bg-card border border-border text-text rounded-full p-2 hover:bg-card-muted transition-colors"
                    aria-label="Remove image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-muted">
                  {selectedFile?.name} ({(selectedFile?.size! / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <svg
                  className="mx-auto h-12 w-12 text-muted"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className="text-text font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          {preview && (
            <Button 
              content='Clear' 
              onClick={handleClear}
            />
          )}

          {!captureData &&
            <Button 
              content='Capture & Extract' 
              type='submit' 
              disabled={!selectedFile || isCaptureDataLoading}
              isLoading={isCaptureDataLoading}
              loadingContent='Processing...'
              styleType='primary'
            />
          }
        </div>

        {/* Error Message */}
        {isCaptureDataError && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
            <p className="text-sm text-red-500">
              {captureDataError instanceof Error
                ? captureDataError.message
                : 'An error occurred while processing the image'}
            </p>
          </div>
        )}
      </form>

      {captureData && (
        <Card size='xl'>
          <Button 
            content='Accept Words & Phrases' 
            onClick={handleAcceptSelection}
            isLoading={false}
            styleType='primary'
          />
          <Spacer size='md' />
          <div className='flex'>
            <div className='w-full'>
              <h1 className='text-2xl'>Words</h1>
              <Spacer />
              {captureData?.words?.map((word, index, arr) => {
                return (
                  <div onClick={()=>toggleAcceptedWord(word.text)} className={`${acceptedWords.includes(word.text) && "text-green-500"}`}>
                    <Card muted>
                      <div>{word?.text}</div>
                      <small>{word?.translation[0]}</small>
                    </Card>
                    {index !== arr.length -1 && <Spacer />}
                  </div>
                )
              })}
            </div>
            <Spacer size='md' />
            <div className='w-full'>
              <h1 className='text-2xl'>Phrases</h1>
              <Spacer />
              {captureData?.phrases?.map((phrase, index, arr) => {
                return (
                  <div onClick={()=>toggleAcceptedPhrases(phrase.text)} className={`${acceptedPhrases.includes(phrase.text) && "text-green-500"}`}>
                  <Card muted>
                    <div>{phrase?.text}</div>
                    <small>{phrase?.translation[0]}</small>
                  </Card>
                  {index !== arr.length -1 && <Spacer />}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Capture;

