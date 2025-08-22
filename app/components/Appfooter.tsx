export default function AppFooter() {
  return (
    <footer className="mt-12 py-6 border-t">
      <div className="max-w-5xl mx-auto px-4 text-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Your Full Name</span>
        <div className="flex gap-4">
          <a className="underline hover:opacity-80" href="https://github.com/your-username" target="_blank" rel="noreferrer">GitHub</a>
          <a className="underline hover:opacity-80" href="https://www.linkedin.com/in/your-handle" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
