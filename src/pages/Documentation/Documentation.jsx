export default function Documentation() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Documentation
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">How ReportEase Works</h1>
        <p className="mt-2 text-sm text-slate-600">
          ReportEase helps you understand medical reports faster by combining OCR and AI insights,
          while keeping your data accessible for future reference.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Report Analysis Flow</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Step 1
            </div>
            <div className="mt-2 text-sm text-slate-700">
              OCR technology extracts text from your uploaded PDF report.
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Step 2
            </div>
            <div className="mt-2 text-sm text-slate-700">
              The extracted text is sent to a Llama model to generate an analysis and health overview.
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Step 3
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Reports are stored securely on Cloudinary so you can download them later if needed.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">AI Doctor Chatbot</h2>
        <p className="mt-3 text-sm text-slate-700">
          Our chatbot uses the Llama 3.1 8B Instant model. To provide relevant and contextual
          suggestions, we keep your health overview plus up to 10 of your previous chat messages
          in context.
        </p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          This gives you fast, consistent guidance without losing important context from your
          recent interactions.
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-amber-900">Medical Disclaimer</h2>
        <p className="mt-3 text-sm text-amber-900">
          ReportEase does not replace professional medical advice. We encourage users to consult
          qualified healthcare professionals for diagnosis and treatment.
        </p>
        <p className="mt-3 text-sm text-amber-900">
          Our goal is to save time, effort, and money by helping you understand reports faster,
          not to replace your doctor.
        </p>
      </div>
    </div>
  );
}
