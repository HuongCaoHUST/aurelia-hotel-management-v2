import { useMemo, useState } from 'react';
import { hasPermission, hasRole, staffPermissions } from '../../app/access.js';

const initialStaff = [
  { id: 1, name: 'Nguyễn Minh Anh', email: 'minhanh@aureliahotel.com', role: 'Receptionist', department: 'Front office', status: 'Active', initials: 'MA', lastActive: '2 min ago', color: 'gold' },
  { id: 2, name: 'Trần Quốc Bảo', email: 'quocbao@aureliahotel.com', role: 'Housekeeper', department: 'Housekeeping', status: 'Active', initials: 'QB', lastActive: '18 min ago', color: 'teal' },
  { id: 3, name: 'Lê Hoàng Nam', email: 'hoangnam@aureliahotel.com', role: 'Manager', department: 'Operations', status: 'Pending', initials: 'LN', lastActive: 'Invited yesterday', color: 'lilac' },
  { id: 4, name: 'Phạm Thu Hà', email: 'thuha@aureliahotel.com', role: 'Technician', department: 'Maintenance', status: 'Active', initials: 'TH', lastActive: '1 hr ago', color: 'rose' },
];

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: 'grid', permission: staffPermissions.viewDashboard },
  { id: 'accounts', label: 'Staff accounts', icon: 'users', permission: staffPermissions.manageStaffAccounts },
];

const stats = [
  { label: "Today's arrivals", value: '18', detail: '6 still to check in', icon: 'calendar', tone: 'gold' },
  { label: 'Occupancy rate', value: '78%', detail: '+8.2% from last week', icon: 'chart', tone: 'teal' },
  { label: 'Rooms available', value: '24', detail: 'of 86 rooms', icon: 'bed', tone: 'blue' },
  { label: 'Open tasks', value: '07', detail: 'Needs attention', icon: 'check', tone: 'rose' },
];

const arrivals = [
  { name: 'James Wilson', initials: 'JW', room: '304', time: '14:00', detail: '2 nights · Deluxe room', status: 'Confirmed', color: 'teal' },
  { name: 'Emma Martin', initials: 'EM', room: '218', time: '15:30', detail: '1 night · Standard room', status: 'Pending', color: 'lilac' },
  { name: 'Olivia Brown', initials: 'OB', room: '512', time: '16:00', detail: '3 nights · Family suite', status: 'Confirmed', color: 'gold' },
];

const activities = [
  { icon: 'check', title: 'Reservation confirmed', detail: 'Room 304 · James Wilson', time: '10 min ago', tone: 'teal' },
  { icon: 'bell', title: 'Housekeeping request', detail: 'Room 218 · In progress', time: '28 min ago', tone: 'gold' },
  { icon: 'alert', title: 'Maintenance reported', detail: 'Room 107 · Air conditioning', time: '1 hr ago', tone: 'rose' },
  { icon: 'user', title: 'New staff invitation', detail: 'Lê Hoàng Nam · Pending', time: '2 hrs ago', tone: 'blue' },
];

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 3-4 3 2 5-7" /></>,
    bed: <><path d="M3 19v-8h18v8M3 15h18M7 11V8h5a3 3 0 0 1 3 3M3 19v2M21 19v2" /></>,
    check: <><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    alert: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" /></>,
    user: <><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function StaffStage({ user, onLogout }) {
  const isAdmin = hasRole(user, 'ADMIN');
  const canViewDashboard = isAdmin && hasPermission(user, staffPermissions.viewDashboard);
  const canManageStaffAccounts = isAdmin && hasPermission(user, staffPermissions.manageStaffAccounts);
  const [activeTab, setActiveTab] = useState(() => canViewDashboard ? 'dashboard' : 'accounts');
  const [accountSection, setAccountSection] = useState('list');
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState('');
  const fullName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Staff member';
  const role = user?.roles?.[0]?.name || user?.roles?.[0] || 'Staff administrator';
  const firstName = fullName.split(' ')[0];
  const accessibleNavItems = navItems.filter((item) => hasPermission(user, item.permission));

  const filteredStaff = useMemo(() => staff.filter((member) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || [member.name, member.email, member.role, member.department].some((field) => field.toLowerCase().includes(query));
    return matchesSearch && (statusFilter === 'All status' || member.status === statusFilter);
  }), [search, staff, statusFilter]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  }

  function handleCreateAccount(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = `${form.get('firstName')} ${form.get('lastName')}`.trim();
    const newMember = { id: Date.now(), name, email: form.get('email'), role: form.get('role'), department: form.get('department'), status: 'Pending', initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), lastActive: 'Invited just now', color: 'gold' };
    setStaff((current) => [newMember, ...current]);
    setModal(null);
    showNotice('Staff invitation created. The account is waiting for activation.');
  }

  function updateMember(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const member = modal.member;
    const name = `${form.get('firstName')} ${form.get('lastName')}`.trim();
    setStaff((current) => current.map((item) => item.id === member.id ? { ...item, name, email: form.get('email'), role: form.get('role'), department: form.get('department'), initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() } : item));
    setModal(null);
    showNotice('Staff account updated.');
  }

  function toggleStatus(member) {
    const nextStatus = member.status === 'Active' ? 'Suspended' : 'Active';
    setStaff((current) => current.map((item) => item.id === member.id ? { ...item, status: nextStatus } : item));
    showNotice(`${member.name} is now ${nextStatus.toLowerCase()}.`);
  }

  if (!accessibleNavItems.length) {
    return <AccessDenied fullName={fullName} onLogout={onLogout} />;
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand brand brand-dark"><span className="brand-mark">A</span><span><strong>AURELIA</strong><small>HOTEL OPERATIONS</small></span></div>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="admin-nav" aria-label="Staff navigation">{accessibleNavItems.map((item) => <div className={`nav-group ${item.id === 'accounts' && activeTab === 'accounts' ? 'is-expanded' : ''}`} key={item.id}><button className={activeTab === item.id ? 'active' : ''} type="button" onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}><span className="nav-icon"><Icon name={item.icon} size={18} /></span><span>{item.label}</span>{item.id === 'accounts' && <span className="nav-chevron"><Icon name="chevron" size={15} /></span>}</button>{item.id === 'accounts' && activeTab === 'accounts' && <ul className="sidebar-subnav" aria-label="Staff account sections"><li><button className={accountSection === 'list' ? 'active' : ''} type="button" onClick={() => setAccountSection('list')}>Danh sách</button></li><li><button className={accountSection === 'permissions' ? 'active' : ''} type="button" onClick={() => setAccountSection('permissions')}>Phân quyền</button></li><li><button className={accountSection === 'audit' ? 'active' : ''} type="button" onClick={() => setAccountSection('audit')}>Nhật ký truy cập</button></li></ul>}</div>)}</nav>
        <div className="sidebar-bottom"><div className="sidebar-help"><span>?</span><div><strong>Need help?</strong><small>Contact administrator</small></div></div><button className="sidebar-signout" type="button" onClick={onLogout}><Icon name="logout" size={17} /><span>Sign out</span></button></div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar"><button className="mobile-menu" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen((open) => !open)}><Icon name="menu" /></button><div className="mobile-brand brand brand-dark"><span className="brand-mark">A</span><span><strong>AURELIA</strong><small>HOTEL OPERATIONS</small></span></div><div className="breadcrumb"><span>Staff portal</span><b>/</b><strong>{activeTab === 'dashboard' ? 'Overview' : 'Staff accounts'}</strong></div><div className="topbar-actions"><button className="notification-button" type="button" aria-label="Notifications"><Icon name="bell" size={19} /><i>3</i></button><div className="topbar-profile"><span className="avatar avatar-gold">{fullName.slice(0, 2).toUpperCase()}</span><span><strong>{fullName}</strong><small>{role}</small></span><span className="chevron">⌄</span></div></div></header>
        <div className="admin-content">{notice && <div className="success-notice" role="status"><Icon name="check" size={16} />{notice}</div>}{activeTab === 'dashboard' && canViewDashboard ? <Dashboard firstName={firstName} setActiveTab={setActiveTab} canManageStaffAccounts={canManageStaffAccounts} /> : canManageStaffAccounts && <Accounts staff={filteredStaff} total={staff.length} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onCreate={() => setModal({ type: 'create' })} onEdit={(member) => setModal({ type: 'edit', member })} onToggle={toggleStatus} />}</div>
      </main>
      {modal && <AccountModal mode={modal.type} member={modal.member} onClose={() => setModal(null)} onSubmit={modal.type === 'edit' ? updateMember : handleCreateAccount} />}
    </div>
  );
}

function Dashboard({ firstName, setActiveTab, canManageStaffAccounts }) {
  return <>
    <div className="page-heading"><div><p className="eyebrow">Wednesday, October 07, 2026 <span className="heading-dot" /> Aurelia Hotel</p><h1>Good morning, {firstName}</h1><p>Here is the operational pulse of your hotel today.</p></div>{canManageStaffAccounts && <button className="primary-button" type="button" onClick={() => setActiveTab('accounts')}><Icon name="plus" size={17} /> Add staff account</button>}</div>
    <section className="stat-grid">{stats.map((stat) => <article className="stat-card" key={stat.label}><div className={`stat-icon ${stat.tone}`}><Icon name={stat.icon} size={19} /></div><p>{stat.label}</p><strong>{stat.value}</strong><small className={stat.tone === 'rose' ? 'stat-change attention' : 'stat-change'}>{stat.detail}</small></article>)}</section>
    <div className="dashboard-grid"><section className="panel occupancy-panel"><PanelHeading eyebrow="Performance" title="Occupancy overview"><button className="select-button" type="button">This week <span>⌄</span></button></PanelHeading><div className="chart-wrap"><div className="chart-y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="bar-chart">{[['Mon',62],['Tue',76],['Wed',68],['Thu',84],['Fri',91],['Sat',78],['Sun',64]].map(([day, value]) => <div className="bar-column" key={day}><div className="bar-value">{value}%</div><div className="bar-track"><div className="bar-fill" style={{ height: `${value}%` }} /></div><span>{day}</span></div>)}</div></div></section><section className="panel activity-panel"><PanelHeading eyebrow="Live updates" title="Recent activity"><button className="link-button" type="button">View all <Icon name="arrow" size={13} /></button></PanelHeading><div className="activity-list">{activities.map((activity) => <Activity key={activity.title} {...activity} />)}</div></section></div>
    <section className="panel arrivals-panel"><PanelHeading eyebrow="Front desk" title="Today’s arrivals"><button className="link-button" type="button">View reservations <Icon name="arrow" size={13} /></button></PanelHeading><div className="arrival-table"><div className="table-row table-head"><span>Guest</span><span>Room</span><span>Arrival</span><span>Status</span></div>{arrivals.map((arrival) => <div className="table-row" key={arrival.name}><span className="guest-cell"><span className={`avatar avatar-${arrival.color}`}>{arrival.initials}</span><span><strong>{arrival.name}</strong><small>{arrival.detail}</small></span></span><span>{arrival.room}</span><span>{arrival.time}</span><span className={`pill ${arrival.status.toLowerCase()}`}>{arrival.status}</span></div>)}</div></section>
  </>;
}

function PanelHeading({ eyebrow, title, children }) { return <div className="panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{children}</div>; }
function Activity({ icon, title, detail, time, tone }) { return <div className="activity-item"><span className={`activity-icon ${tone}`}><Icon name={icon} size={14} /></span><div><strong>{title}</strong><small>{detail}</small></div><time>{time}</time></div>; }

function Accounts({ staff, total, search, setSearch, statusFilter, setStatusFilter, onCreate, onEdit, onToggle }) {
  return <><div className="page-heading accounts-heading"><div><p className="eyebrow">People & access <span className="heading-dot" /> {total} members</p><h1>Staff accounts</h1><p>Manage the people who keep Aurelia Hotel running smoothly.</p></div><button className="primary-button" type="button" onClick={onCreate}><Icon name="plus" size={17} /> Invite staff</button></div><section className="panel accounts-panel"><div className="accounts-toolbar"><label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, role or email" aria-label="Search staff" /></label><div className="toolbar-actions"><select className="filter-button" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option>All status</option><option>Active</option><option>Pending</option><option>Suspended</option></select><button className="filter-button" type="button">Newest first <span>⌄</span></button></div></div>{staff.length ? <div className="account-table"><div className="account-row account-head"><span>Team member</span><span>Role & department</span><span>Status</span><span>Last active</span><span /></div>{staff.map((member) => <div className="account-row" key={member.id}><span className="guest-cell"><span className={`avatar avatar-${member.color}`}>{member.initials}</span><span><strong>{member.name}</strong><small>{member.email}</small></span></span><span><strong className="role-name">{member.role}</strong><small>{member.department}</small></span><span><span className={`pill ${member.status.toLowerCase()}`}>{member.status}</span></span><span className="last-active">{member.lastActive}</span><span className="row-actions"><button type="button" className="row-action" onClick={() => onEdit(member)}>Edit</button><button type="button" className="row-action row-action-muted" onClick={() => onToggle(member)}>{member.status === 'Active' ? 'Suspend' : 'Activate'}</button></span></div>)}</div> : <div className="empty-state"><span><Icon name="search" size={20} /></span><h3>No staff accounts found</h3><p>Try a different search or status filter.</p></div>}<p className="table-foot">Showing {staff.length} of {total} staff accounts · Changes are currently held in this workspace.</p></section></>;
}

function AccountModal({ mode, member, onClose, onSubmit }) {
  const nameParts = member?.name.split(' ') || ['', ''];
  const firstName = member ? nameParts.slice(0, -1).join(' ') : '';
  const lastName = member ? nameParts.at(-1) : '';
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-modal-title"><div className="modal-heading"><div><p className="eyebrow">Staff portal</p><h2 id="account-modal-title">{mode === 'edit' ? 'Edit staff account' : 'Invite a team member'}</h2><p>{mode === 'edit' ? 'Keep this person’s access details up to date.' : 'An invitation will be sent to their work email.'}</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div><form className="account-form" onSubmit={onSubmit}><div className="form-row"><label htmlFor="firstName">First name<input id="firstName" name="firstName" defaultValue={firstName} placeholder="Minh" required /></label><label htmlFor="lastName">Last name<input id="lastName" name="lastName" defaultValue={lastName} placeholder="Anh" required /></label></div><label htmlFor="email">Work email<input id="email" name="email" type="email" defaultValue={member?.email || ''} placeholder="name@aureliahotel.com" required /></label><div className="form-row"><label htmlFor="department">Department<select id="department" name="department" defaultValue={member?.department || 'Front office'}><option>Front office</option><option>Housekeeping</option><option>Operations</option><option>Maintenance</option></select></label><label htmlFor="role">Role<select id="role" name="role" defaultValue={member?.role || 'Receptionist'}><option>Receptionist</option><option>Housekeeper</option><option>Manager</option><option>Technician</option></select></label></div><div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{mode === 'edit' ? 'Save changes' : 'Send invitation'}</button></div></form></div></div>;
}

function AccessDenied({ fullName, onLogout }) {
  return <main className="access-denied"><div className="access-denied-card"><div className="brand brand-dark"><span className="brand-mark">A</span><span><strong>AURELIA</strong><small>HOTEL OPERATIONS</small></span></div><p className="eyebrow">Access restricted</p><h1>Hello, {fullName}</h1><p>Your account does not currently have permission to access the staff workspace. Please contact an administrator to assign the appropriate role permissions.</p><button className="secondary-button" type="button" onClick={onLogout}><Icon name="logout" size={17} /> Sign out</button></div></main>;
}
