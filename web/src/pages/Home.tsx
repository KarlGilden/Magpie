const Home = () => {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <p className="text-sm uppercase tracking-wide text-accent">
            Capture &amp; Learn
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Bring image text into your vocabulary faster
          </h1>
          <p className="text-lg text-muted">
            Upload snapshots, extract text with AI, and turn it into bite-sized
            translations and phrases you can learn on the go.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg bg-accent px-4 py-2 text-white shadow hover:opacity-90">
              Start Capturing
            </button>
            <button className="rounded-lg border border-border px-4 py-2 text-text hover:border-accent">
              View Samples
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Current language</p>
                <p className="text-lg font-semibold text-text">Spanish</p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                Live Preview
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-border bg-card-muted p-3 text-text">
                "Las bibliotecas son templos de conocimiento."
              </div>
              <div className="rounded-lg border border-border p-3 text-sm text-muted">
                "Libraries are temples of knowledge."
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                  <p className="font-semibold text-text">bibliotecas</p>
                  <p className="text-muted">libraries</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                  <p className="font-semibold text-text">conocimiento</p>
                  <p className="text-muted">knowledge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Upload', desc: 'Send images from camera or gallery.' },
          { title: 'Extract', desc: 'Document AI pulls clean text quickly.' },
          { title: 'Learn', desc: 'Phrases and translations ready to study.' },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-accent">
              {item.title}
            </p>
            <p className="mt-2 text-muted">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;

