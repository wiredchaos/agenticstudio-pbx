import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";

const breakdown = [
  { scene: "1A", int: "EXT", location: "Mojave / Trailer", pages: "1 1/8", cast: "DAUGHTER", props: "Urn, ring of keys", est: 4200 },
  { scene: "1B", int: "INT", location: "Father's studio", pages: "2 3/8", cast: "DAUGHTER", props: "16mm projector, reels x12", est: 8800 },
  { scene: "2", int: "EXT", location: "Mojave / Ridge", pages: "5/8", cast: "DAUGHTER", props: "—", est: 1900 },
  { scene: "3", int: "INT", location: "Diner, Ludlow", pages: "3", cast: "DAUGHTER, COOK", props: "Coffee, payphone", est: 6400 },
  { scene: "4", int: "EXT", location: "Highway 40", pages: "1 1/2", cast: "DAUGHTER", props: "1972 Bronco", est: 5200 },
];
const cast = [
  { name: "DAUGHTER", role: "Lead", days: 18, agencyEst: 64000 },
  { name: "COOK", role: "Day-player", days: 1, agencyEst: 1200 },
  { name: "FATHER (V/O)", role: "Voice", days: 2, agencyEst: 8500 },
];
const budget = [
  { line: "Cast (incl. agency)", value: 73700 },
  { line: "Locations + permits", value: 18200 },
  { line: "Props + production design", value: 22400 },
  { line: "Crew (10 days)", value: 96000 },
  { line: "Insurance (E&O)", value: 4800 },
  { line: "Marketing reserve", value: 12000 },
];

export default function Scribe() {
  const [loaded, setLoaded] = useState(false);
  const total = budget.reduce((s, b) => s + b.value, 0);
  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">SCRIBE — Writer + Line Producer</p>
        <h1 className="font-bagel text-4xl">Script breakdown.</h1>
      </div>
      {!loaded ? (
        <div className="glass-effect rounded-xl p-12 text-center">
          <Upload className="w-10 h-10 mx-auto text-white/30 mb-4" />
          <p className="text-white/60 mb-4">Drop a script. PDF or Final Draft.</p>
          <button onClick={() => { setLoaded(true); toast.success("Parsing AFTER THE BURN…"); }} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-semibold">Use sample script</button>
        </div>
      ) : (
        <>
          <Card title="Scene breakdown">
            <Table headers={["Scene", "INT/EXT", "Location", "Pages", "Cast", "Props", "Est. cost"]} rows={breakdown.map((b) => [b.scene, b.int, b.location, b.pages, b.cast, b.props, `$${b.est.toLocaleString()}`])} />
          </Card>
          <Card title="Cast + agency fees">
            <Table headers={["Role", "Type", "Days", "Agency est."]} rows={cast.map((c) => [c.name, c.role, c.days, `$${c.agencyEst.toLocaleString()}`])} />
          </Card>
          <Card title="Budget">
            <Table headers={["Line item", "Amount"]} rows={budget.map((b) => [b.line, `$${b.value.toLocaleString()}`])} footer={["Total", `$${total.toLocaleString()}`]} />
          </Card>
          <button onClick={() => toast.success("Mock export")} className="glass-effect px-5 py-2.5 rounded-md flex items-center gap-2 hover:bg-white/10"><Download className="w-4 h-4" /> Export</button>
        </>
      )}
    </div>
  );
}

function Card({ title, children }: any) { return (<div className="glass-effect rounded-xl p-6"><h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">{title}</h2>{children}</div>); }
function Table({ headers, rows, footer }: { headers: string[]; rows: any[][]; footer?: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left text-white/40 text-xs uppercase tracking-widest">{headers.map((h) => <th key={h} className="py-2 pr-4">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => (<tr key={i} className="border-t border-white/5">{r.map((c, j) => <td key={j} className="py-3 pr-4 text-white/85">{c}</td>)}</tr>))}</tbody>
      {footer && <tfoot><tr className="border-t border-white/20 font-bold">{footer.map((c, j) => <td key={j} className="py-3 pr-4">{c}</td>)}</tr></tfoot>}
    </table>
  );
}
