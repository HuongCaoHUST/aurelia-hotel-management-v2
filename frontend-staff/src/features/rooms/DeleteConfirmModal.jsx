export function DeleteConfirmModal({
  entityLabel,
  itemName,
  itemDetails,
  description,
  warning,
  dialogId,
  isDeleting,
  onClose,
  onConfirm,
}) {
  const actionLabel = entityLabel.toLowerCase();

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !isDeleting && onClose()}>
    <div className="account-modal delete-role-modal room-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby={`${dialogId}-title`} aria-describedby={`${dialogId}-description`}>
      <div className="delete-role-modal-top">
        <span className="delete-role-icon"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg></span>
        <button className="close-button" type="button" onClick={onClose} disabled={isDeleting} aria-label="Close"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      </div>
      <p className="eyebrow">{entityLabel} removal</p>
      <h2 id={`${dialogId}-title`}>Delete {itemName}?</h2>
      <p className="delete-role-copy" id={`${dialogId}-description`}>{description}</p>
      <div className="delete-role-card room-delete-card"><span className="room-delete-card-mark"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 19v-8h18v8M3 15h18M7 11V8h5a3 3 0 0 1 3 3M3 19v2M21 19v2" /></svg></span><span><strong>{itemName}</strong><small>{itemDetails}</small></span></div>
      <div className="delete-role-warning"><span>!</span><p>{warning}</p></div>
      <div className="form-actions"><button className="secondary-button" type="button" onClick={onClose} disabled={isDeleting}>Cancel</button><button className="danger-button" type="button" onClick={onConfirm} disabled={isDeleting}><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>{isDeleting ? 'Deleting…' : `Delete ${actionLabel}`}</button></div>
    </div>
  </div>;
}
