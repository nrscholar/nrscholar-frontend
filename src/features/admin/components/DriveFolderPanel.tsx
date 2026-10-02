import { useEffect, useState } from "react";
import { FolderSearch } from "lucide-react";
import { adminApi, type FolderMatch } from "../adminApi";
import { Badge, Button, Card, ErrorNote } from "./AdminUI";

/**
 * GSEB publishes each standard's textbooks as PDFs in one Google Drive folder.
 * Paste the folder once; each subject of the class gets its book suggested.
 */
export default function DriveFolderPanel({ board, classLevel, onSaved }: { board: string; classLevel: string; onSaved: () => void }) {
  const [folderUrl, setFolderUrl] = useState("");
  const [matches, setMatches] = useState<FolderMatch[] | null>(null);
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    setMatches(null);
    setSaved(null);
    adminApi.officialFolder(board, classLevel).then((url) => setFolderUrl(url || ""), () => setFolderUrl(""));
  }, [board, classLevel]);

  const find = async () => {
    setBusy("find");
    setError(null);
    setSaved(null);
    try {
      const r = await adminApi.matchFolder(folderUrl.trim(), board, classLevel);
      setMatches(r.matches);
      setChoice(Object.fromEntries(r.matches.map((m) => [m.subjectId, m.suggested?.url || m.currentUrl || ""])));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const save = async () => {
    const items = Object.entries(choice).filter(([, url]) => url).map(([subjectId, url]) => ({ subjectId, url }));
    setBusy("save");
    setError(null);
    try {
      await adminApi.saveOfficialSources(items, folderUrl.trim(), board, classLevel);
      setSaved(`Saved for ${items.length} subject(s). Open a subject and click "Verify all pending".`);
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <FolderSearch className="h-4 w-4" /> GSEB textbooks for {classLevel}: Google Drive folder
      </div>
      <p className="text-xs text-slate-500">
        Paste the Drive folder link GSEB shares for this standard (shared as "Anyone with the link"). Each subject's textbook PDF is suggested
        automatically; check the matches and save.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={folderUrl} onChange={(e) => setFolderUrl(e.target.value)} placeholder="https://drive.google.com/drive/folders/…"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary" />
        <Button variant="secondary" disabled={!folderUrl.trim()} busy={busy === "find"} onClick={find}>Find textbooks</Button>
      </div>
      <ErrorNote message={error} />

      {matches && (
        <div className="space-y-2">
          {matches.length === 0 && <p className="text-sm text-slate-500">No subjects found for this class.</p>}
          {matches.map((m) => {
            const options = m.candidates.length ? m.candidates : [];
            return (
              <div key={m.subjectId} className="grid items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 sm:grid-cols-[200px_1fr_auto]">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">{m.subjectName}</div>
                  <div className="truncate text-xs text-slate-500">{m.description}</div>
                </div>
                <select value={choice[m.subjectId] || ""} onChange={(e) => setChoice({ ...choice, [m.subjectId]: e.target.value })}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm">
                  <option value="">— none (skip this subject) —</option>
                  {options.map((f) => <option key={f.url} value={f.url}>{f.name}</option>)}
                  {m.currentUrl && !options.some((f) => f.url === m.currentUrl) && <option value={m.currentUrl}>Current: {m.currentUrl}</option>}
                </select>
                <span>
                  {m.confidence === "high" && <Badge tone="green">Good match</Badge>}
                  {m.confidence === "low" && <Badge tone="amber">Check this</Badge>}
                  {m.confidence === "none" && <Badge tone="slate">No PDF found</Badge>}
                </span>
              </div>
            );
          })}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="success" busy={busy === "save"} disabled={!Object.values(choice).some(Boolean)} onClick={save}>Save links</Button>
            {saved && <span className="text-xs font-semibold text-emerald-700">{saved}</span>}
          </div>
        </div>
      )}
    </Card>
  );
}
