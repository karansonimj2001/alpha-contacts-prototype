import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Activity, ArrowDownUp, ArrowRight, Bell, Check, CheckCheck, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, Download, Filter, Grid2X2, LayoutGrid,
  List, Mail, MoreHorizontal, Plus, Search, Settings2, SlidersHorizontal, Sparkles,
  X, Users, Building2, Clock3, Tag, UserRound, StickyNote, CircleDot,
} from 'lucide-react'

type Stage = 'Lead' | 'Prospect' | 'Qualified' | 'Customer'
type Contact = {
  id: string; name: string; email: string; company: string; role: string; owner: string;
  labels: string[]; stage: Stage; notes: string; initials: string; color: string; updated: string
}
type View = 'table' | 'board'

const STAGES: Stage[] = ['Lead', 'Prospect', 'Qualified', 'Customer']
const initialContacts: Contact[] = [
  { id: 'c1', name: 'Olivia Rhye', email: 'olivia@untitledui.com', company: 'Untitled UI', role: 'Product Designer', owner: 'Olivia Rhye', labels: ['Design', 'SaaS'], stage: 'Lead', notes: 'Met at the Product Design meetup. Interested in consolidating their current workflow.', initials: 'OR', color: 'lavender', updated: 'Today, 10:42 AM' },
  { id: 'c2', name: 'Phoenix Baker', email: 'phoenix@linear.app', company: 'Linear', role: 'Engineering Manager', owner: 'Drew Cano', labels: ['Product-led', 'SaaS'], stage: 'Prospect', notes: 'Asked for a walkthrough for the platform team. Follow up with the short product video.', initials: 'PB', color: 'peach', updated: 'Today, 9:18 AM' },
  { id: 'c3', name: 'Lana Steiner', email: 'lana@layers.to', company: 'Layers', role: 'VP of Product', owner: 'Olivia Rhye', labels: ['Enterprise'], stage: 'Qualified', notes: 'Strong fit. Budget owner is involved and the team is targeting a Q4 rollout.', initials: 'LS', color: 'mint', updated: 'Yesterday' },
  { id: 'c4', name: 'Demi Wilkinson', email: 'demi@circooles.com', company: 'Circooles', role: 'Head of Growth', owner: 'Drew Cano', labels: ['Growth', 'SaaS'], stage: 'Customer', notes: 'Customer since September. Expansion opportunity across two additional teams.', initials: 'DW', color: 'blue', updated: 'Yesterday' },
  { id: 'c5', name: 'Candice Wu', email: 'candice@catalog.app', company: 'Catalog', role: 'Founder', owner: 'Phoenix Baker', labels: ['Startup'], stage: 'Lead', notes: '', initials: 'CW', color: 'rose', updated: 'Oct 18, 2026' },
  { id: 'c6', name: 'Natali Craig', email: 'natali@quotient.co', company: 'Quotient', role: 'Operations Lead', owner: 'Olivia Rhye', labels: ['Operations'], stage: 'Prospect', notes: 'Currently evaluating two alternatives. Prioritize a comparison focused on onboarding time.', initials: 'NC', color: 'gold', updated: 'Oct 17, 2026' },
  { id: 'c7', name: 'Drew Cano', email: 'drew@command.com', company: 'Command', role: 'Co-founder', owner: 'Phoenix Baker', labels: ['Founder', 'SaaS'], stage: 'Qualified', notes: 'Intro came through the founder network. Decision meeting pencilled in for next week.', initials: 'DC', color: 'teal', updated: 'Oct 16, 2026' },
  { id: 'c8', name: 'Orlando Diggs', email: 'orlando@techbox.io', company: 'Techbox', role: 'Sales Director', owner: 'Drew Cano', labels: ['Enterprise', 'Sales'], stage: 'Customer', notes: 'Renewal is on track. Share the updated quarterly business review before the next call.', initials: 'OD', color: 'sky', updated: 'Oct 15, 2026' },
  { id: 'c9', name: 'Andi Lane', email: '', company: '—', role: 'Marketing Lead', owner: 'Olivia Rhye', labels: ['Inbound'], stage: 'Lead', notes: 'Contact details still need confirming. Reached out through the website form.', initials: 'AL', color: 'pink', updated: 'Oct 14, 2026' },
  { id: 'c10', name: 'Kate Morrison', email: 'kate@wildcrafted.co', company: 'Wildcrafted', role: 'Chief of Staff', owner: 'Phoenix Baker', labels: ['Retail'], stage: 'Prospect', notes: 'Looking for a lightweight setup to coordinate a distributed team.', initials: 'KM', color: 'green', updated: 'Oct 12, 2026' },
]

const stageMeta: Record<Stage, { tone: string; dot: string; description: string }> = {
  Lead: { tone: 'stage-lead', dot: '#8b8d98', description: 'New contacts to explore' },
  Prospect: { tone: 'stage-prospect', dot: '#d58a35', description: 'Active conversations' },
  Qualified: { tone: 'stage-qualified', dot: '#6978d8', description: 'Ready for a decision' },
  Customer: { tone: 'stage-customer', dot: '#259879', description: 'Working relationships' },
}
const avatarColors: Record<string, string> = {
  lavender: 'avatar-lavender', peach: 'avatar-peach', mint: 'avatar-mint', blue: 'avatar-blue', rose: 'avatar-rose',
  gold: 'avatar-gold', teal: 'avatar-teal', sky: 'avatar-sky', pink: 'avatar-pink', green: 'avatar-green',
}

function Avatar({ contact, size = 'normal' }: { contact: Pick<Contact, 'initials' | 'color'>; size?: 'normal' | 'small' | 'large' }) {
  return <span className={`avatar ${avatarColors[contact.color] || 'avatar-lavender'} avatar-${size}`} aria-hidden="true">{contact.initials}</span>
}
function StagePill({ stage }: { stage: Stage }) {
  return <span className={`stage-pill ${stageMeta[stage].tone}`}><span className="stage-dot" />{stage}</span>
}
function LabelPill({ label }: { label: string }) {
  return <span className={`label-pill label-${label.toLowerCase().replace(/[^a-z]/g, '')}`}>{label}</span>
}

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [view, setView] = useState<View>('table')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Contact | null>(null)
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<Stage | 'All stages'>('All stages')
  const [showFilters, setShowFilters] = useState(false)
  const [savedToast, setSavedToast] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newStage, setNewStage] = useState<Stage>('Lead')
  const panelRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const selected = contacts.find((contact) => contact.id === selectedId) ?? null
  const visibleContacts = useMemo(() => contacts.filter((contact) => {
    const needle = query.trim().toLowerCase()
    const matchesQuery = !needle || [contact.name, contact.email, contact.company, contact.role, contact.owner, ...contact.labels].some((value) => value.toLowerCase().includes(needle))
    return matchesQuery && (stageFilter === 'All stages' || contact.stage === stageFilter)
  }), [contacts, query, stageFilter])
  const totalCustomers = contacts.filter((contact) => contact.stage === 'Customer').length
  const activePipeline = contacts.filter((contact) => contact.stage === 'Prospect' || contact.stage === 'Qualified').length

  useEffect(() => {
    if (selectedId) {
      setDraft({ ...(contacts.find((contact) => contact.id === selectedId) ?? initialContacts[0]), labels: [...(contacts.find((contact) => contact.id === selectedId)?.labels ?? [])] })
      requestAnimationFrame(() => closeButtonRef.current?.focus())
    } else {
      setDraft(null)
      returnFocusRef.current?.focus()
    }
  }, [selectedId]) // Draft is intentionally reset only when opening a different record.

  function openContact(contact: Contact, trigger?: HTMLElement) {
    returnFocusRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    setSelectedId(contact.id)
  }
  function closePanel() { setSelectedId(null) }
  function saveDraft(event?: FormEvent) {
    event?.preventDefault()
    if (!draft) return
    setContacts((current) => current.map((contact) => contact.id === draft.id ? { ...draft, updated: 'Just now' } : contact))
    setSavedToast(true)
    window.setTimeout(() => setSavedToast(false), 2400)
    closePanel()
  }
  function cancelDraft() { closePanel() }
  function handlePanelKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') { event.preventDefault(); closePanel() }
  }
  function addContact(event: FormEvent) {
    event.preventDefault()
    if (!newName.trim()) return
    const initials = newName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    const contact: Contact = { id: `c${Date.now()}`, name: newName.trim(), email: newEmail.trim(), company: newCompany.trim() || '—', role: '', owner: 'Olivia Rhye', labels: [], stage: newStage, notes: '', initials, color: 'lavender', updated: 'Just now' }
    setContacts((current) => [contact, ...current])
    setShowAdd(false); setNewName(''); setNewEmail(''); setNewCompany(''); setNewStage('Lead')
    openContact(contact)
  }
  function exportCsv() {
    const headers = ['Name', 'Email', 'Company', 'Role', 'Owner', 'Labels', 'Stage', 'Notes']
    const rows = contacts.map((c) => [c.name, c.email, c.company, c.role, c.owner, c.labels.join(', '), c.stage, c.notes])
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a'); link.href = url; link.download = 'alpha-contacts.csv'; link.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="workspace-switcher">
          <div className="brand-mark"><span /><span /><span /><span /></div>
          <div className="workspace-copy"><strong>alpha</strong><span>Workspace</span></div>
          <button className="icon-button workspace-chevron" aria-label="Switch workspace"><ChevronDown size={15} /></button>
        </div>
        <div className="sidebar-search"><Search size={15} /><span>Search workspace</span><kbd>⌘ K</kbd></div>
        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          <button className="nav-item"><Grid2X2 size={17} /><span>Overview</span></button>
          <button className="nav-item"><Activity size={17} /><span>Activity</span><span className="nav-count">3</span></button>
          <button className="nav-item active"><Users size={17} /><span>Contacts</span><span className="nav-count">{contacts.length}</span></button>
          <button className="nav-item"><Building2 size={17} /><span>Companies</span></button>
        </nav>
        <div className="sidebar-section-row"><span className="sidebar-section-label">YOUR VIEWS</span><button className="tiny-icon" aria-label="Add view"><Plus size={14} /></button></div>
        <nav className="primary-nav" aria-label="Saved views">
          <button className="nav-item sub-active"><span className="view-color-dot dot-purple" /><span>All contacts</span></button>
          <button className="nav-item"><span className="view-color-dot dot-orange" /><span>New leads</span></button>
          <button className="nav-item"><span className="view-color-dot dot-green" /><span>Customers</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={15} /></div><strong>Make space for good work.</strong><p>Keep your relationships moving forward.</p><button onClick={() => setShowAdd(true)}>Add a contact <ArrowRight size={13} /></button></div>
          <button className="nav-item"><CircleHelp size={17} /><span>Help & support</span></button>
          <button className="nav-item"><Settings2 size={17} /><span>Settings</span></button>
          <div className="user-profile"><div className="user-avatar">KR</div><div className="user-profile-copy"><strong>Karan Rao</strong><span>Free plan</span></div><button className="icon-button" aria-label="Profile menu"><MoreHorizontal size={17} /></button></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>Contacts</strong></div>
          <div className="topbar-actions"><button className="icon-button topbar-icon" aria-label="Notifications"><Bell size={17} /><i /></button><span className="topbar-divider" /><button className="help-link"><CircleHelp size={15} /> Help center</button><div className="user-avatar small-user">KR</div></div>
        </header>

        <div className={`page-content ${selected ? 'with-panel' : ''}`}>
          <section className="page-heading">
            <div className="heading-eyebrow"><span className="eyebrow-line" /> RELATIONSHIP MANAGEMENT <span className="eyebrow-line" /></div>
            <div className="heading-main-row"><div><h1>Contacts<span className="heading-period">.</span></h1><p className="heading-description">Good relationships start with a little organization.</p></div><button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={16} strokeWidth={2.4} /> Add contact</button></div>
            <div className="metrics-row">
              <div className="metric-card"><div className="metric-icon metric-violet"><Users size={16} /></div><div><span className="metric-label">Total contacts</span><div className="metric-number">{contacts.length}<span className="metric-change"><ArrowRight size={11} /> +2 this week</span></div></div></div>
              <div className="metric-card"><div className="metric-icon metric-amber"><Clock3 size={16} /></div><div><span className="metric-label">Active pipeline</span><div className="metric-number">{activePipeline}<span className="metric-caption">Prospects + qualified</span></div></div></div>
              <div className="metric-card"><div className="metric-icon metric-green"><CheckCheck size={16} /></div><div><span className="metric-label">Customers</span><div className="metric-number">{totalCustomers}<span className="metric-caption">Relationships built</span></div></div></div>
              <div className="metric-card metric-note"><div className="metric-note-mark"><Sparkles size={15} /></div><div><span className="metric-label">A little reminder</span><p>Follow up thoughtfully.<br /><strong>Small things build trust.</strong></p></div></div>
            </div>
          </section>

          <section className="database-section" aria-label="Contacts database">
            <div className="database-header"><div className="database-title-wrap"><div className="database-icon"><Users size={17} /></div><div><div className="database-title">All contacts <ChevronDown size={14} /></div><div className="database-subtitle">Your people, all in one place</div></div></div><div className="database-header-right"><span className="live-indicator"><span /> Up to date</span><button className="icon-button" aria-label="More database options"><MoreHorizontal size={19} /></button></div></div>
            <div className="toolbar"><div className="view-switch" role="tablist" aria-label="Contact view"><button role="tab" aria-selected={view === 'table'} className={view === 'table' ? 'selected' : ''} onClick={() => setView('table')}><List size={15} /> Table</button><button role="tab" aria-selected={view === 'board'} className={view === 'board' ? 'selected' : ''} onClick={() => setView('board')}><LayoutGrid size={15} /> Board</button></div><div className="toolbar-spacer" /><label className="search-field"><Search size={15} /><input aria-label="Search contacts" placeholder="Search contacts..." value={query} onChange={(e) => setQuery(e.target.value)} /><kbd>/</kbd></label><button className={`toolbar-button ${showFilters || stageFilter !== 'All stages' ? 'toolbar-button-active' : ''}`} onClick={() => setShowFilters((value) => !value)}><Filter size={15} /> Filter{stageFilter !== 'All stages' && <span className="filter-count">1</span>}</button><button className="toolbar-button view-options" onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal size={15} /><span>Properties</span></button><button className="toolbar-icon" aria-label="Export contacts as CSV" title="Export CSV" onClick={exportCsv}><Download size={15} /></button><button className="toolbar-icon" aria-label="Sort contacts" title="Sort by name" onClick={() => setContacts((current) => [...current].reverse())}><ArrowDownUp size={15} /></button></div>
            {showFilters && <div className="filter-bar"><span className="filter-label">Stage is</span><select aria-label="Filter by stage" value={stageFilter} onChange={(e) => setStageFilter(e.target.value as Stage | 'All stages')}><option>All stages</option>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select>{stageFilter !== 'All stages' && <button className="clear-filter" onClick={() => setStageFilter('All stages')}>Clear filter <X size={12} /></button>}<span className="filter-hint">Filters apply to both views</span></div>}
            <div className="database-view-area">
              {view === 'table' ? <TableView contacts={visibleContacts} onOpen={openContact} onQuickStage={(id, stage) => setContacts((current) => current.map((c) => c.id === id ? { ...c, stage, updated: 'Just now' } : c))} /> : <BoardView contacts={visibleContacts} onOpen={openContact} onQuickStage={(id, stage) => setContacts((current) => current.map((c) => c.id === id ? { ...c, stage, updated: 'Just now' } : c))} onAddStage={(stage) => { setNewStage(stage); setShowAdd(true) }} />}
            </div>
            <footer className="database-footer"><div><span className="footer-status-dot" /> Showing <strong>{visibleContacts.length}</strong> of <strong>{contacts.length}</strong> contacts</div><div className="footer-right"><span>Last synced just now</span><button aria-label="Previous page" disabled><ChevronLeft size={15} /></button><button aria-label="Next page" disabled><ChevronRight size={15} /></button></div></footer>
          </section>
          <div className="page-footnote"><span>MADE FOR BETTER CONNECTIONS</span><span>Thoughtful work, together. <span className="footnote-heart">♥</span></span></div>
        </div>
      </main>

      {selected && draft && <>
        <button className="panel-backdrop" aria-label="Close contact details" onClick={cancelDraft} />
        <aside className="details-panel" ref={panelRef} onKeyDown={handlePanelKeyDown} aria-label={`Edit ${selected.name}`}>
          <div className="panel-topbar"><div className="panel-breadcrumb"><span>Contacts</span><ChevronRight size={13} /><span>{selected.name}</span></div><div className="panel-top-actions"><button className="icon-button" aria-label="More contact options"><MoreHorizontal size={18} /></button><button className="icon-button" onClick={closePanel} aria-label="Close details panel" ref={closeButtonRef}><X size={17} /></button></div></div>
          <form className="panel-form" onSubmit={saveDraft}>
            <div className="panel-hero"><Avatar contact={draft} size="large" /><div className="panel-hero-copy"><span className="panel-eyebrow">CONTACT PROFILE</span><h2>{draft.name || 'New contact'}</h2><p>{draft.role || 'Role not added'}{draft.company && draft.company !== '—' ? ` at ${draft.company}` : ''}</p></div><button className="icon-button panel-hero-menu" type="button" aria-label="More profile actions"><MoreHorizontal size={18} /></button></div>
            <div className="panel-section-heading"><span>Contact details</span><span className="section-rule" /></div>
            <div className="detail-fields">
              <label className="detail-field"><span><UserRound size={14} /> Name</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value, initials: e.target.value.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || '').join('').toUpperCase() })} required /></label>
              <label className="detail-field"><span><Mail size={14} /> Email</span><input type="email" value={draft.email} placeholder="Add an email" onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></label>
              <label className="detail-field"><span><Building2 size={14} /> Company</span><input value={draft.company === '—' ? '' : draft.company} placeholder="Add a company" onChange={(e) => setDraft({ ...draft, company: e.target.value || '—' })} /></label>
              <label className="detail-field"><span><UserRound size={14} /> Role</span><input value={draft.role} placeholder="Add a role" onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></label>
              <label className="detail-field"><span><Users size={14} /> Owner</span><select value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })}><option>Olivia Rhye</option><option>Drew Cano</option><option>Phoenix Baker</option></select><ChevronDown className="select-chevron" size={13} /></label>
              <div className="detail-field labels-detail"><span><Tag size={14} /> Labels</span><div className="detail-labels">{draft.labels.map((label) => <button type="button" key={label} className="label-remove" onClick={() => setDraft({ ...draft, labels: draft.labels.filter((l) => l !== label) })}><LabelPill label={label} /><X size={11} /></button>)}<button type="button" className="add-label" title="Add label" onClick={() => { const label = window.prompt('Add a label'); if (label?.trim() && !draft.labels.includes(label.trim())) setDraft({ ...draft, labels: [...draft.labels, label.trim()] }) }}><Plus size={13} /> Add</button></div></div>
              <label className="detail-field stage-detail"><span><CircleDot size={14} /> Stage</span><select className="stage-select" value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value as Stage })}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select><ChevronDown className="select-chevron" size={13} /></label>
            </div>
            <div className="panel-section-heading notes-heading"><span>Notes</span><span className="section-rule" /></div>
            <label className="notes-input-wrap"><span className="sr-only">Notes</span><textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Add context, next steps, or anything worth remembering..." rows={5} /><span className="notes-helper"><StickyNote size={12} /> Just for your team</span></label>
            <div className="panel-record-meta"><div className="meta-avatar">KR</div><span>Last edited by <strong>Karan Rao</strong></span><span className="meta-dot">·</span><span>{selected.updated}</span></div>
            <div className="panel-footer"><button type="button" className="secondary-button" onClick={cancelDraft}>Cancel</button><button type="submit" className="primary-button save-button"><Check size={15} /> Save changes</button></div>
          </form>
        </aside>
      </>}

      {showAdd && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAdd(false) }}><form className="add-modal" onSubmit={addContact}><div className="modal-header"><div><span className="panel-eyebrow">GROW YOUR NETWORK</span><h2>Add a contact</h2><p>A good connection starts somewhere.</p></div><button type="button" className="icon-button" aria-label="Close add contact" onClick={() => setShowAdd(false)}><X size={17} /></button></div><label className="modal-field">Full name <input autoFocus required placeholder="e.g. Jamie Smith" value={newName} onChange={(e) => setNewName(e.target.value)} /></label><label className="modal-field">Email <input type="email" placeholder="jamie@company.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></label><label className="modal-field">Company <input placeholder="Company name" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} /></label><label className="modal-field">Stage <select value={newStage} onChange={(e) => setNewStage(e.target.value as Stage)}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAdd(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={15} /> Create contact</button></div></form></div>}
      {savedToast && <div className="toast" role="status"><span><Check size={14} /></span> Changes saved successfully</div>}
    </div>
  )
}

function TableView({ contacts, onOpen, onQuickStage }: { contacts: Contact[]; onOpen: (contact: Contact, trigger?: HTMLElement) => void; onQuickStage: (id: string, stage: Stage) => void }) {
  const [menuId, setMenuId] = useState<string | null>(null)
  return <div className="table-scroll"><table className="contacts-table"><thead><tr><th className="name-column"><span className="column-title"><Users size={13} /> Name</span></th><th><span className="column-title"><Mail size={13} /> Email</span></th><th><span className="column-title"><Building2 size={13} /> Company</span></th><th><span className="column-title"><UserRound size={13} /> Role</span></th><th><span className="column-title"><Users size={13} /> Owner</span></th><th><span className="column-title"><Tag size={13} /> Labels</span></th><th><span className="column-title"><CircleDot size={13} /> Stage</span></th><th className="row-menu-column"><span className="sr-only">Actions</span></th></tr></thead><tbody>{contacts.map((contact) => <tr key={contact.id} className="contact-row" onDoubleClick={(e) => onOpen(contact, e.currentTarget)}><td className="name-cell"><button className="contact-name-button" onClick={(e) => onOpen(contact, e.currentTarget)}><Avatar contact={contact} size="small" /><span className="contact-name-text"><strong>{contact.name}</strong><span>{contact.role || 'No role added'}</span></span></button></td><td><span className={`email-cell ${!contact.email ? 'muted-cell' : ''}`}>{contact.email || '—'}</span></td><td><span className={!contact.company || contact.company === '—' ? 'muted-cell' : ''}>{contact.company || '—'}</span></td><td><span className={!contact.role ? 'muted-cell' : ''}>{contact.role || '—'}</span></td><td><span className="owner-cell"><span className={`owner-avatar owner-${contact.owner.split(' ')[0].toLowerCase()}`}>{contact.owner.split(' ').map((p) => p[0]).join('')}</span>{contact.owner}</span></td><td><div className="table-labels">{contact.labels.length ? <>{contact.labels.slice(0, 2).map((label) => <LabelPill key={label} label={label} />)}{contact.labels.length > 2 && <span className="more-labels">+{contact.labels.length - 2}</span>}</> : <span className="muted-cell">—</span>}</div></td><td><div className="table-stage-wrap"><button className="stage-button" onClick={() => setMenuId(menuId === contact.id ? null : contact.id)} aria-label={`Change ${contact.name} stage`} aria-expanded={menuId === contact.id}><StagePill stage={contact.stage} /><ChevronDown size={12} /></button>{menuId === contact.id && <><button className="menu-dismiss" aria-label="Close stage menu" onClick={() => setMenuId(null)} /><div className="stage-menu">{STAGES.map((stage) => <button key={stage} onClick={() => { onQuickStage(contact.id, stage); setMenuId(null) }}><StagePill stage={stage} />{contact.stage === stage && <Check size={13} />}</button>)}</div></>}</div></td><td className="row-menu-column"><button className="row-more" aria-label={`Open ${contact.name} details`} onClick={(e) => onOpen(contact, e.currentTarget)}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table>{contacts.length === 0 && <EmptyState title="No contacts found" body="Try a different search or clear your filters." />}</div>
}

function BoardView({ contacts, onOpen, onQuickStage, onAddStage }: { contacts: Contact[]; onOpen: (contact: Contact, trigger?: HTMLElement) => void; onQuickStage: (id: string, stage: Stage) => void; onAddStage: (stage: Stage) => void }) {
  const [menuId, setMenuId] = useState<string | null>(null)
  return <div className="board-scroll"><div className="board-columns">{STAGES.map((stage) => { const items = contacts.filter((contact) => contact.stage === stage); return <section className="board-column" key={stage} aria-label={`${stage} contacts`}><div className="board-column-header"><div className="board-stage-title"><span className="board-stage-dot" style={{ background: stageMeta[stage].dot }} /><h3>{stage}</h3><span className="board-count">{items.length}</span></div><button className="tiny-icon" aria-label={`Add ${stage.toLowerCase()}`} title={`Add ${stage.toLowerCase()}`}><Plus size={15} /></button></div><p className="board-column-description">{stageMeta[stage].description}</p><div className="board-card-list">{items.map((contact) => <article className="contact-card" key={contact.id}><div className="contact-card-top"><Avatar contact={contact} size="small" /><button className="card-more" aria-label={`Open ${contact.name} details`} onClick={(e) => onOpen(contact, e.currentTarget)}><MoreHorizontal size={16} /></button></div><button className="card-name" onClick={(e) => onOpen(contact, e.currentTarget)}>{contact.name}</button><p className="card-company">{contact.role || 'Role not added'}{contact.company && contact.company !== '—' ? <><span> at </span>{contact.company}</> : ''}</p><div className="card-email">{contact.email ? <><Mail size={12} />{contact.email}</> : <span className="muted-cell">No email added</span>}</div>{contact.labels.length > 0 && <div className="card-labels">{contact.labels.slice(0, 2).map((label) => <LabelPill key={label} label={label} />)}</div>}{contact.notes && <p className="card-note">{contact.notes}</p>}<div className="card-bottom"><span className="card-owner"><span className={`owner-avatar owner-${contact.owner.split(' ')[0].toLowerCase()}`}>{contact.owner.split(' ').map((p) => p[0]).join('')}</span>{contact.owner.split(' ')[0]}</span><div className="card-stage-wrap"><button className="card-stage-trigger" aria-label={`Move ${contact.name} to another stage`} aria-expanded={menuId === contact.id} onClick={() => setMenuId(menuId === contact.id ? null : contact.id)}><MoreHorizontal size={15} /></button>{menuId === contact.id && <><button className="menu-dismiss" aria-label="Close stage menu" onClick={() => setMenuId(null)} /><div className="stage-menu board-stage-menu">{STAGES.filter((s) => s !== contact.stage).map((s) => <button key={s} onClick={() => { onQuickStage(contact.id, s); setMenuId(null) }}><StagePill stage={s} /><ArrowRight size={12} /></button>)}</div></>}</div></div></article>)}{items.length === 0 && <div className="empty-column"><div className="empty-column-icon"><Plus size={17} /></div><strong>No {stage.toLowerCase()}s yet</strong><span>Contacts will appear here</span></div>}</div><button className="board-add-button" onClick={() => onAddStage(stage)}><Plus size={14} /> Add a contact</button></section> })}</div>{contacts.length === 0 && <EmptyState title="No contacts match" body="Try changing your search or filters to see your contacts." />}</div>
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><div className="empty-state-icon"><Search size={19} /></div><strong>{title}</strong><p>{body}</p></div>
}
